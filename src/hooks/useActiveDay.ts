'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import {
  getOrCreateActiveDay,
  subscribeToDay,
  expireDay,
  getActiveDayIds,
} from '@/lib/firestore'
import { isTimestampExpired } from '@/lib/dayUtils'

export function useActiveDay(uid: string) {
  const { setDayDoc, setDayLoading, setActiveDayIds } = useAppStore()

  useEffect(() => {
    if (!uid) return
    let unsubscribe: (() => void) | undefined

    async function init() {
      setDayLoading(true)
      try {
        const { dayId, dayDoc } = await getOrCreateActiveDay(uid)
        setDayDoc(dayDoc, dayId)

        const dayIds = await getActiveDayIds(uid)
        setActiveDayIds(dayIds)

        unsubscribe = subscribeToDay(uid, dayId, async (updatedDoc) => {
          // If the day just expired while the user is active, re-init
          if (
            updatedDoc.status === 'locked' &&
            isTimestampExpired(updatedDoc.expires_at)
          ) {
            await expireDay(uid, dayId, updatedDoc)
            await init()
            return
          }
          setDayDoc(updatedDoc, dayId)
        })
      } finally {
        setDayLoading(false)
      }
    }

    init()
    return () => unsubscribe?.()
  }, [uid, setDayDoc, setDayLoading, setActiveDayIds])
}
