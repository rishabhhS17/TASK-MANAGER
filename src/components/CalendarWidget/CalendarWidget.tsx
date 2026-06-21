'use client'

import { useState } from 'react'
import dayjs from 'dayjs'
import { useAppStore } from '@/store/useAppStore'
import { getTodayId, formatShortDate } from '@/lib/dayUtils'
import styles from './CalendarWidget.module.css'

interface CalendarWidgetProps {
  onDateClick: (dayId: string) => void
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function CalendarWidget({ onDateClick }: CalendarWidgetProps) {
  const { activeDayIds } = useAppStore()
  const [monthOffset, setMonthOffset] = useState(0)

  const current = dayjs().add(monthOffset, 'month')
  const todayId = getTodayId()
  const activeSet = new Set(activeDayIds)

  // Monday-first offset (0=Mon, 6=Sun)
  const firstDow = current.startOf('month').day()
  const startOffset = (firstDow + 6) % 7

  const cells: (string | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: current.daysInMonth() }, (_, i) =>
      current.date(i + 1).format('YYYY-MM-DD')
    ),
  ]

  return (
    <div className={styles.widget} role="region" aria-label="Calendar">
      <div className={styles.header}>
        <button
          className={styles.navBtn}
          onClick={() => setMonthOffset((m) => m - 1)}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className={styles.month}>{current.format('MMM YYYY')}</span>
        <button
          className={styles.navBtn}
          onClick={() => setMonthOffset((m) => m + 1)}
          disabled={monthOffset >= 0}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className={styles.weekdays} aria-hidden="true">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className={styles.weekday}>{d}</span>
        ))}
      </div>

      <div className={styles.grid}>
        {cells.map((dayId, i) => {
          if (!dayId) return <span key={`e${i}`} aria-hidden="true" />

          const isToday = dayId === todayId
          const isActive = activeSet.has(dayId)
          const isPast = dayId < todayId
          const isClickable = isActive && isPast

          return (
            <button
              key={dayId}
              className={[
                styles.day,
                isToday ? styles.today : '',
                isActive ? styles.active : '',
                isClickable ? styles.clickable : '',
              ].join(' ')}
              onClick={isClickable ? () => onDateClick(dayId) : undefined}
              disabled={!isClickable}
              aria-label={isClickable ? `View ${formatShortDate(dayId)}` : undefined}
              aria-current={isToday ? 'date' : undefined}
              tabIndex={isClickable ? 0 : -1}
            >
              {dayjs(dayId).date()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
