import dayjs from 'dayjs'
import type { Timestamp } from 'firebase/firestore'

export function getTodayId(): string {
  return dayjs().format('YYYY-MM-DD')
}

export function formatDisplayDate(dateId: string): string {
  return dayjs(dateId).format('MMM D, YYYY')
}

export function formatShortDate(dateId: string): string {
  return dayjs(dateId).format('MMM D')
}

export function isTimestampExpired(expires_at: Timestamp | null): boolean {
  if (!expires_at) return false
  return dayjs().isAfter(dayjs(expires_at.toDate()))
}

export function getExpiryDate(): Date {
  return dayjs().add(24, 'hour').toDate()
}
