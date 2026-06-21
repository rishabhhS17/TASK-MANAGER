'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { signInWithGoogle, signInWithEmail, signUpWithEmail, getAuthErrorMessage } from '@/lib/auth'
import styles from './page.module.css'

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    } catch (err) {
      setError(getAuthErrorMessage(err))
      setLoading(false)
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password)
      } else {
        await signUpWithEmail(email, password)
      }
      router.replace('/')
    } catch (err) {
      setError(getAuthErrorMessage(err))
      setLoading(false)
    }
  }

  function toggleMode() {
    setMode(m => m === 'signin' ? 'signup' : 'signin')
    setError(null)
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

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <form className={styles.form} onSubmit={handleEmailSubmit}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading || authLoading}
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            disabled={loading || authLoading}
          />
          <button
            className={styles.submitBtn}
            type="submit"
            disabled={loading || authLoading}
          >
            {loading ? '…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.toggle}>
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button className={styles.toggleBtn} onClick={toggleMode} disabled={loading}>
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </main>
  )
}
