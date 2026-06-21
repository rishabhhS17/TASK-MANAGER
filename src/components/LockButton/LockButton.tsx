import styles from './LockButton.module.css'

interface LockButtonProps {
  onClick: () => void
  disabled: boolean
}

export default function LockButton({ onClick, disabled }: LockButtonProps) {
  return (
    <button
      className={styles.btn}
      onClick={onClick}
      disabled={disabled}
      aria-label="Lock in for today — irreversible"
    >
      Lock in for today
    </button>
  )
}
