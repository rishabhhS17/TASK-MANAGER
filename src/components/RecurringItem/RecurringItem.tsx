'use client'

import type { RecurringTask } from '@/types'
import styles from './RecurringItem.module.css'

interface RecurringItemProps {
  item: RecurringTask
  onDelete: () => void
}

export default function RecurringItem({ item, onDelete }: RecurringItemProps) {
  return (
    <div className={styles.item}>
      <span className={styles.name}>{item.task_name}</span>
      <button
        className={styles.deleteBtn}
        onClick={onDelete}
        aria-label={`Remove ${item.task_name} from recurring tasks`}
      >
        ✕
      </button>
    </div>
  )
}
