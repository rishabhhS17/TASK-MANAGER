import type { Timestamp } from 'firebase/firestore'
import type { DayStatus } from '@/types'
import styles from './PhaseTag.module.css'

interface PhaseTagProps {
  status: DayStatus
  expiresAt: Timestamp | null
}

function getExpiryLabel(expiresAt: Timestamp | null): string {
  if (!expiresAt) return ''
  const ms = expiresAt.toDate().getTime() - Date.now()
  if (ms <= 0) return ''
  const h = Math.floor(ms / (1000 * 60 * 60))
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  return `${h}h ${m}m left`
}

export default function PhaseTag({ status, expiresAt }: PhaseTagProps) {
  const timeLeft = status === 'locked' ? getExpiryLabel(expiresAt) : null

  return (
    <div className={styles.wrapper}>
      <span className={`${styles.tag} ${styles[status]}`}>
        {status === 'unlocked' && 'Planning'}
        {status === 'locked' && 'Locked'}
        {status === 'expired' && 'Done'}
      </span>
      {timeLeft && (
        <span className={styles.expiry}>{timeLeft}</span>
      )}
    </div>
  )
}
