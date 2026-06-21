'use client'

import { useAppStore } from '@/store/useAppStore'
import { addTask, deleteTask, tickTask, lockDay } from '@/lib/firestore'
import { formatDisplayDate } from '@/lib/dayUtils'
import PhaseTag from '@/components/PhaseTag/PhaseTag'
import TaskItem from '@/components/TaskItem/TaskItem'
import AddTaskInput from '@/components/AddTaskInput/AddTaskInput'
import LockButton from '@/components/LockButton/LockButton'
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog'
import CalendarWidget from '@/components/CalendarWidget/CalendarWidget'
import LedgerModal from '@/components/LedgerModal/LedgerModal'
import styles from './page.module.css'

export default function TodayPage() {
  const {
    user,
    dayDoc, dayId, dayLoading,
    isLockDialogOpen, setLockDialogOpen,
    ledgerDate, setLedgerDate,
  } = useAppStore()

  if (dayLoading || !dayDoc || !dayId) {
    return (
      <div className={styles.loading}>
        <span className={styles.loadingText}>Setting up your day…</span>
      </div>
    )
  }

  const isLocked = dayDoc.status === 'locked'
  const tasks = dayDoc.tasks
  const doneCount = tasks.filter((t) => t.status === 'done').length

  async function handleAddTask(name: string) {
    await addTask(user!.uid, dayId!, name, tasks)
  }

  async function handleDeleteTask(taskId: string) {
    await deleteTask(user!.uid, dayId!, taskId, tasks)
  }

  async function handleTickTask(taskId: string) {
    await tickTask(user!.uid, dayId!, taskId, tasks)
  }

  async function handleLock() {
    await lockDay(user!.uid, dayId!)
    setLockDialogOpen(false)
  }

  return (
    <div className={`${styles.page} ${isLocked ? styles.locked : ''}`}>
      <div className={styles.header}>
        <div className={styles.meta}>
          <PhaseTag status={dayDoc.status} expiresAt={dayDoc.expires_at} />
          <h1 className={styles.date}>{formatDisplayDate(dayId)}</h1>
        </div>
        {isLocked && tasks.length > 0 && (
          <span className={styles.progress}>
            {doneCount} / {tasks.length}
          </span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.taskSection}>
          <div className={styles.card}>
            {tasks.length === 0 ? (
              <p className={styles.empty}>
                {isLocked
                  ? 'No tasks were locked in.'
                  : 'No tasks yet. Add one below.'}
              </p>
            ) : (
              <ul className={styles.taskList} role="list">
                {tasks.map((task) => (
                  <li key={task.id}>
                    <TaskItem
                      task={task}
                      mode={isLocked ? 'execution' : 'planning'}
                      onDelete={() => handleDeleteTask(task.id)}
                      onTick={() => handleTickTask(task.id)}
                    />
                  </li>
                ))}
              </ul>
            )}

            {!isLocked && (
              <AddTaskInput onAdd={handleAddTask} />
            )}
          </div>

          {!isLocked && (
            <div className={styles.lockArea}>
              <LockButton
                onClick={() => setLockDialogOpen(true)}
                disabled={tasks.length === 0}
              />
              {tasks.length === 0 && (
                <p className={styles.hint}>Add at least one task to lock in.</p>
              )}
            </div>
          )}
        </div>

        <aside className={styles.sidebar}>
          <CalendarWidget onDateClick={setLedgerDate} />
        </aside>
      </div>

      <ConfirmDialog
        isOpen={isLockDialogOpen}
        title="Lock in for today?"
        message="Once locked, you cannot add or remove tasks. The day expires 24 hours from now. This is irreversible."
        confirmLabel="Lock In"
        onConfirm={handleLock}
        onCancel={() => setLockDialogOpen(false)}
      />

      {ledgerDate && (
        <LedgerModal
          dayId={ledgerDate}
          uid={user!.uid}
          onClose={() => setLedgerDate(null)}
        />
      )}
    </div>
  )
}
