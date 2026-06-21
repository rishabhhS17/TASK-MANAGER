'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { User } from 'firebase/auth'
import { signOut } from '@/lib/auth'
import styles from './ProfileDropdown.module.css'

function Initials({ name }: { name: string }) {
  const letters = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  return <span className={styles.initials}>{letters}</span>
}

export default function ProfileDropdown({ user }: { user: User }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const displayName = user.displayName ?? user.email ?? 'User'

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        className={styles.avatarBtn}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open profile menu"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={displayName}
            width={32}
            height={32}
            className={styles.avatarImg}
            referrerPolicy="no-referrer"
          />
        ) : (
          <Initials name={displayName} />
        )}
      </button>

      {open && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.profileHeader}>
            <div className={styles.avatarLarge}>
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={displayName}
                  width={48}
                  height={48}
                  className={styles.avatarImgLarge}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Initials name={displayName} />
              )}
            </div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>{displayName}</span>
              {user.email && (
                <span className={styles.profileEmail}>{user.email}</span>
              )}
            </div>
          </div>

          <div className={styles.divider} />

          <button
            className={styles.signOutBtn}
            role="menuitem"
            onClick={() => {
              setOpen(false)
              signOut()
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
