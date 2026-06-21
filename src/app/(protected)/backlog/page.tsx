'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import {
  subscribeToBacklog,
  addBacklogToToday,
  deleteBacklogItem,
} from '@/lib/firestore'
import BacklogItem from '@/components/BacklogItem/BacklogItem'
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog'
import styles from './page.module.css'

export default function BacklogPage() {
  const {
    user,
    dayDoc, dayId,
    backlogItems, setBacklogItems,
    isDeleteBacklogDialogOpen,
    deletingBacklogId,
    openDeleteBacklogDialog,
    closeDeleteBacklogDialog,
  } = useAppStore()

  useEffect(() => {
    if (!user) return
    return subscribeToBacklog(user.uid, setBacklogItems)
  }, [user, setBacklogItems])

  const isLocked = dayDoc?.status === 'locked'

  async function handleAddToToday(itemId: string) {
    if (!user || !dayId || !dayDoc || isLocked) return
    const item = backlogItems.find((i) => i.id === itemId)
    if (!item) return
    const alreadyAdded = dayDoc.tasks.some((t) => t.backlog_item_id === itemId)
    if (alreadyAdded) return
    await addBacklogToToday(user.uid, dayId, dayDoc.tasks, item)
  }

  async function handleDeleteConfirm() {
    if (!user || !deletingBacklogId) return
    await deleteBacklogItem(user.uid, deletingBacklogId)
    closeDeleteBacklogDialog()
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Backlog</h1>
        {backlogItems.length > 0 && (
          <span className={styles.count}>
            {backlogItems.length} item{backlogItems.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {isLocked && (
        <p className={styles.lockedNote}>
          Today is locked — you cannot add backlog items until tomorrow.
        </p>
      )}

      {backlogItems.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden="true">✓</span>
          <p className={styles.emptyText}>Nothing in your backlog. Great work.</p>
        </div>
      ) : (
        <ul className={styles.list} role="list">
          {backlogItems.map((item) => (
            <li key={item.id}>
              <BacklogItem
                item={item}
                isLocked={!!isLocked}
                onAddToToday={() => handleAddToToday(item.id)}
                onDelete={() => openDeleteBacklogDialog(item.id)}
              />
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        isOpen={isDeleteBacklogDialogOpen}
        title="Remove from backlog?"
        message="This task will be permanently removed. You won't see it again."
        confirmLabel="Remove"
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteBacklogDialog}
      />
    </div>
  )
}
