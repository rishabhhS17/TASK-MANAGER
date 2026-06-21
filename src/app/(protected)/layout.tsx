'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { useActiveDay } from '@/hooks/useActiveDay'
import Navbar from '@/components/Navbar/Navbar'
import styles from './layout.module.css'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, authLoading } = useAppStore()
  const router = useRouter()

  useActiveDay(user?.uid ?? '')

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return (
      <div className={styles.loading} aria-label="Loading">
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    )
  }

  return (
    <div className={styles.shell}>
      <Navbar user={user} />
      <main className={styles.main}>{children}</main>
    </div>
  )
}
