'use client'

import { useState } from 'react'
import type { BacklogItem as BacklogItemType } from '@/types'
import { formatDisplayDate } from '@/lib/dayUtils'
import styles from './BacklogItem.module.css'

interface BacklogItemProps {
  item: BacklogItemType
  isLocked: boolean
  onAddToToday: () => Promise<void>
  onDelete: () => void
}

export default function BacklogItem({
  item,
  isLocked,
  onAddToToday,
  onDelete,
}: BacklogItemProps) {
  const [adding, setAdding] = useState(false)

  async function handleAdd() {
    setAdding(true)
    try {
      await onAddToToday()
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className={styles.item}>
      <div className={styles.info}>
        <span className={styles.name}>{item.task_name}</span>
        <span className={styles.date}>Since {formatDisplayDate(item.source_day_id)}</span>
      </div>
      <div className={styles.actions}>
        {!isLocked && (
          <button
            className={styles.addBtn}
            onClick={handleAdd}
            disabled={adding}
            aria-label={`Add ${item.task_name} to today`}
          >
            {adding ? '…' : '+ Today'}
          </button>
        )}
        <button
          className={styles.deleteBtn}
          onClick={onDelete}
          aria-label={`Remove ${item.task_name} from backlog`}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
