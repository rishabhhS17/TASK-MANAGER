'use client'

import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase'
import { useAppStore } from '@/store/useAppStore'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setAuthLoading } = useAppStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      setUser(user)
      setAuthLoading(false)
    })
    return unsubscribe
  }, [setUser, setAuthLoading])

  return <>{children}</>
}
