'use client'

import { useState, useEffect, useRef } from 'react'
import { getLedgerDay } from '@/lib/firestore'
import { formatDisplayDate } from '@/lib/dayUtils'
import type { DayDocument } from '@/types'
import styles from './LedgerModal.module.css'

interface LedgerModalProps {
  dayId: string
  uid: string
  onClose: () => void
}

export default function LedgerModal({ dayId, uid, onClose }: LedgerModalProps) {
  const [doc, setDoc] = useState<DayDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()
    getLedgerDay(uid, dayId)
      .then(setDoc)
      .finally(() => setLoading(false))
  }, [uid, dayId])

  function handleBackdrop(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onCancel={onClose}
      onClick={handleBackdrop}
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          <div>
            <span className={styles.label}>Ledger</span>
            <h2 className={styles.date}>{formatDisplayDate(dayId)}</h2>
          </div>
          <button
            className={styles.close}
            onClick={onClose}
            aria-label="Close ledger"
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {loading && <p className={styles.meta}>Loading…</p>}

          {!loading && !doc && (
            <p className={styles.meta}>No data for this day.</p>
          )}

          {!loading && doc && (
            <>
              {doc.tasks.length === 0 ? (
                <p className={styles.meta}>No tasks were recorded.</p>
              ) : (
                <ul className={styles.tasks} role="list">
                  {doc.tasks.map((task) => (
                    <li
                      key={task.id}
                      className={`${styles.task} ${
                        task.status === 'done' ? styles.done : styles.failed
                      }`}
                    >
                      <span className={styles.icon} aria-hidden="true">
                        {task.status === 'done' ? '✓' : '✗'}
                      </span>
                      <span className={styles.name}>{task.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </dialog>
  )
}
