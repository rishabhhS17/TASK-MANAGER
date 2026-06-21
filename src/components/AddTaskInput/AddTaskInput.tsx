'use client'

import { useState, useRef } from 'react'
import styles from './AddTaskInput.module.css'

interface AddTaskInputProps {
  onAdd: (name: string) => Promise<void>
  placeholder?: string
}

export default function AddTaskInput({ onAdd, placeholder = 'Add a task…' }: AddTaskInputProps) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || loading) return
    setLoading(true)
    try {
      await onAdd(trimmed)
      setValue('')
      inputRef.current?.focus()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className={styles.input}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={loading}
        aria-label="New task name"
        maxLength={200}
      />
      <button
        type="submit"
        className={styles.addBtn}
        disabled={!value.trim() || loading}
        aria-label="Add task"
      >
        +
      </button>
    </form>
  )
}
