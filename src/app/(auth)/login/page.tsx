'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { signInWithGoogle } from '@/lib/auth'
import styles from './page.module.css'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user, authLoading } = useAppStore()

  useEffect(() => {
    if (!authLoading && user) router.replace('/')
  }, [user, authLoading, router])

  async function handleGoogleSignIn() {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
      router.replace('/')
    } catch {
      setError('Sign in failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.center}>
        <h1 className={styles.wordmark}>LockIn</h1>
        <p className={styles.tagline}>Plan. Lock. Execute.</p>
        <p className={styles.sub}>
          The daily task engine that holds you accountable.
        </p>
        <button
          className={styles.googleBtn}
          onClick={handleGoogleSignIn}
          disabled={loading || authLoading}
        >
          {loading ? 'Signing in…' : 'Continue with Google'}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </main>
  )
}
