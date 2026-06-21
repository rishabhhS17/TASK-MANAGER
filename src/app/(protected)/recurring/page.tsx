'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import {
  subscribeToRecurring,
  addRecurringTask,
  deleteRecurringTask,
} from '@/lib/firestore'
import RecurringItem from '@/components/RecurringItem/RecurringItem'
import AddTaskInput from '@/components/AddTaskInput/AddTaskInput'
import styles from './page.module.css'

export default function RecurringPage() {
  const {
    user,
    recurringTasks, setRecurringTasks,
  } = useAppStore()

  useEffect(() => {
    if (!user) return
    return subscribeToRecurring(user.uid, setRecurringTasks)
  }, [user, setRecurringTasks])

  async function handleAdd(name: string) {
    if (!user) return
    await addRecurringTask(user.uid, name)
  }

  async function handleDelete(itemId: string) {
    if (!user) return
    await deleteRecurringTask(user.uid, itemId)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Recurring</h1>
        {recurringTasks.length > 0 && (
          <span className={styles.count}>
            {recurringTasks.length} routine{recurringTasks.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <p className={styles.description}>
        These tasks are automatically added to each new day when it begins.
      </p>

      {recurringTasks.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden="true">↻</span>
          <p className={styles.emptyText}>No recurring tasks. Add a daily routine below.</p>
        </div>
      ) : (
        <ul className={styles.list} role="list">
          {recurringTasks.map((item) => (
            <li key={item.id}>
              <RecurringItem
                item={item}
                onDelete={() => handleDelete(item.id)}
              />
            </li>
          ))}
        </ul>
      )}

      <div className={styles.addSection}>
        <AddTaskInput onAdd={handleAdd} placeholder="Add a routine…" />
      </div>
    </div>
  )
}
