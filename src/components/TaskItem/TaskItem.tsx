'use client'

import type { Task } from '@/types'
import styles from './TaskItem.module.css'

interface TaskItemProps {
  task: Task
  mode: 'planning' | 'execution'
  onDelete?: () => void
  onTick?: () => void
}

export default function TaskItem({ task, mode, onDelete, onTick }: TaskItemProps) {
  if (mode === 'execution') {
    const isDone = task.status === 'done'
    return (
      <div className={`${styles.item} ${isDone ? styles.done : ''}`}>
        <button
          className={`${styles.checkbox} ${isDone ? styles.checked : ''}`}
          onClick={onTick}
          disabled={isDone}
          aria-label={isDone ? `${task.name} — completed` : `Mark ${task.name} as done`}
          aria-pressed={isDone}
        >
          {isDone && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <span className={styles.name}>{task.name}</span>
      </div>
    )
  }

  return (
    <div className={styles.item}>
      <span className={styles.bullet} aria-hidden="true">○</span>
      <span className={styles.name}>{task.name}</span>
      <button
        className={styles.deleteBtn}
        onClick={onDelete}
        aria-label={`Remove task: ${task.name}`}
      >
        ✕
      </button>
    </div>
  )
}
