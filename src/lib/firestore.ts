import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  Timestamp,
  writeBatch,
  deleteDoc,
  orderBy,
} from 'firebase/firestore'
import { getFirebaseDb } from './firebase'
import { getTodayId, isTimestampExpired, getExpiryDate } from './dayUtils'
import type { DayDocument, Task, BacklogItem, RecurringTask } from '@/types'

// ─── Path helpers ────────────────────────────────────────────────────────────

function dayRef(uid: string, dayId: string) {
  return doc(getFirebaseDb(), 'users', uid, 'days', dayId)
}

function backlogCol(uid: string) {
  return collection(getFirebaseDb(), 'users', uid, 'backlog')
}

function backlogItemRef(uid: string, itemId: string) {
  return doc(getFirebaseDb(), 'users', uid, 'backlog', itemId)
}

function recurringCol(uid: string) {
  return collection(getFirebaseDb(), 'users', uid, 'recurring')
}

function recurringItemRef(uid: string, itemId: string) {
  return doc(getFirebaseDb(), 'users', uid, 'recurring', itemId)
}

// ─── Day lifecycle ────────────────────────────────────────────────────────────

export async function getOrCreateActiveDay(
  uid: string
): Promise<{ dayId: string; dayDoc: DayDocument }> {
  // 1. Check for any locked day (only one can exist at a time)
  const lockedQ = query(
    collection(getFirebaseDb(), 'users', uid, 'days'),
    where('status', '==', 'locked')
  )
  const lockedSnap = await getDocs(lockedQ)

  for (const snap of lockedSnap.docs) {
    const data = snap.data() as DayDocument
    if (!isTimestampExpired(data.expires_at)) {
      return { dayId: snap.id, dayDoc: data }
    }
    await expireDay(uid, snap.id, data)
  }

  // 2. Check for today's unlocked document
  const todayId = getTodayId()
  const todaySnap = await getDoc(dayRef(uid, todayId))
  if (todaySnap.exists()) {
    const data = todaySnap.data() as DayDocument
    if (data.status === 'unlocked') {
      return { dayId: todayId, dayDoc: data }
    }
  }

  // 3. Create fresh unlocked day for today, seeded with recurring tasks
  const recurring = await getRecurringTasks(uid)
  const seededTasks: Task[] = recurring.map((r) => ({
    id: crypto.randomUUID(),
    name: r.task_name,
    status: 'pending' as const,
  }))
  const newDay: DayDocument = {
    status: 'unlocked',
    locked_at: null,
    expires_at: null,
    tasks: seededTasks,
  }
  await setDoc(dayRef(uid, todayId), newDay)
  return { dayId: todayId, dayDoc: newDay }
}

export function subscribeToDay(
  uid: string,
  dayId: string,
  callback: (doc: DayDocument) => void
): () => void {
  return onSnapshot(
    dayRef(uid, dayId),
    (snap) => { if (snap.exists()) callback(snap.data() as DayDocument) },
    () => { /* permission revoked on sign-out — listener will be cleaned up */ }
  )
}

export async function expireDay(
  uid: string,
  dayId: string,
  dayDoc: DayDocument
): Promise<void> {
  const batch = writeBatch(getFirebaseDb())

  // Only write truly new tasks to backlog — not ones that already came from backlog
  const pendingOriginal = dayDoc.tasks.filter(
    (t) => t.status === 'pending' && !t.backlog_item_id
  )

  for (const task of pendingOriginal) {
    const ref = doc(backlogCol(uid))
    batch.set(ref, {
      task_name: task.name,
      source_day_id: dayId,
      source_task_id: task.id,
      created_at: Timestamp.now(),
    })
  }

  batch.update(dayRef(uid, dayId), { status: 'expired' })
  await batch.commit()
}

// ─── Task operations (planning phase) ────────────────────────────────────────

export async function addTask(
  uid: string,
  dayId: string,
  name: string,
  currentTasks: Task[]
): Promise<void> {
  const newTask: Task = {
    id: crypto.randomUUID(),
    name,
    status: 'pending',
  }
  await updateDoc(dayRef(uid, dayId), { tasks: [...currentTasks, newTask] })
}

export async function deleteTask(
  uid: string,
  dayId: string,
  taskId: string,
  currentTasks: Task[]
): Promise<void> {
  await updateDoc(dayRef(uid, dayId), {
    tasks: currentTasks.filter((t) => t.id !== taskId),
  })
}

// ─── Lock ────────────────────────────────────────────────────────────────────

export async function lockDay(uid: string, dayId: string): Promise<void> {
  await updateDoc(dayRef(uid, dayId), {
    status: 'locked',
    locked_at: Timestamp.now(),
    expires_at: Timestamp.fromDate(getExpiryDate()),
  })
}

// ─── Tick (execution phase) ──────────────────────────────────────────────────

export async function tickTask(
  uid: string,
  dayId: string,
  taskId: string,
  currentTasks: Task[]
): Promise<void> {
  const task = currentTasks.find((t) => t.id === taskId)
  if (!task) return

  const updatedTasks = currentTasks.map((t) =>
    t.id === taskId ? { ...t, status: 'done' as const } : t
  )

  // If this task came from the backlog, remove it from the backlog collection
  if (task.backlog_item_id) {
    const batch = writeBatch(getFirebaseDb())
    batch.update(dayRef(uid, dayId), { tasks: updatedTasks })
    batch.delete(backlogItemRef(uid, task.backlog_item_id))
    await batch.commit()
  } else {
    await updateDoc(dayRef(uid, dayId), { tasks: updatedTasks })
  }
}

// ─── Backlog operations ───────────────────────────────────────────────────────

export async function addBacklogToToday(
  uid: string,
  dayId: string,
  currentTasks: Task[],
  item: BacklogItem
): Promise<void> {
  const newTask: Task = {
    id: crypto.randomUUID(),
    name: `${item.task_name} (backlog of ${item.source_day_id})`,
    status: 'pending',
    backlog_item_id: item.id,
    source_day_id: item.source_day_id,
    source_task_id: item.source_task_id,
  }
  await updateDoc(dayRef(uid, dayId), {
    tasks: [...currentTasks, newTask],
  })
}

export function subscribeToBacklog(
  uid: string,
  callback: (items: BacklogItem[]) => void
): () => void {
  const q = query(backlogCol(uid), orderBy('created_at', 'asc'))
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as BacklogItem))
      callback(items)
    },
    () => { /* permission revoked on sign-out — listener will be cleaned up */ }
  )
}

export async function deleteBacklogItem(uid: string, itemId: string): Promise<void> {
  await deleteDoc(backlogItemRef(uid, itemId))
}

// ─── Recurring tasks ─────────────────────────────────────────────────────────

export async function getRecurringTasks(uid: string): Promise<RecurringTask[]> {
  const q = query(recurringCol(uid), orderBy('created_at', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as RecurringTask))
}

export async function addRecurringTask(uid: string, taskName: string): Promise<void> {
  const ref = doc(recurringCol(uid))
  await setDoc(ref, { task_name: taskName, created_at: Timestamp.now() })
}

export async function deleteRecurringTask(uid: string, itemId: string): Promise<void> {
  await deleteDoc(recurringItemRef(uid, itemId))
}

export function subscribeToRecurring(
  uid: string,
  callback: (items: RecurringTask[]) => void
): () => void {
  const q = query(recurringCol(uid), orderBy('created_at', 'asc'))
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as RecurringTask))
      callback(items)
    },
    () => { /* permission revoked on sign-out */ }
  )
}

// ─── Ledger (read-only history) ──────────────────────────────────────────────

export async function getLedgerDay(
  uid: string,
  dayId: string
): Promise<DayDocument | null> {
  const snap = await getDoc(dayRef(uid, dayId))
  return snap.exists() ? (snap.data() as DayDocument) : null
}

export async function getActiveDayIds(uid: string): Promise<string[]> {
  const q = query(
    collection(getFirebaseDb(), 'users', uid, 'days'),
    where('status', 'in', ['locked', 'expired'])
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => d.id).sort()
}
