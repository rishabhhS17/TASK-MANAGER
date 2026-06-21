import type { Timestamp } from 'firebase/firestore'

export type DayStatus = 'unlocked' | 'locked' | 'expired'
export type TaskStatus = 'pending' | 'done'

export interface Task {
  id: string
  name: string
  status: TaskStatus
  backlog_item_id?: string
  source_day_id?: string
  source_task_id?: string
}

export interface DayDocument {
  status: DayStatus
  locked_at: Timestamp | null
  expires_at: Timestamp | null
  tasks: Task[]
}

export interface BacklogItem {
  id: string
  task_name: string
  source_day_id: string
  source_task_id: string
  created_at: Timestamp
}

export interface LedgerDay {
  dayId: string
  doc: DayDocument
}

export interface RecurringTask {
  id: string
  task_name: string
  created_at: Timestamp
}
