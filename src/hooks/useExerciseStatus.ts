import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'sqlviz_completed_exercises'

function readFromStorage(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return new Set<string>(parsed)
    return new Set()
  } catch {
    return new Set()
  }
}

function writeToStorage(completed: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]))
  } catch {
    // Fail silently if storage quota is full or unavailable
  }
}

export function useExerciseStatus() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setCompletedIds(readFromStorage())
  }, [])

  const markComplete = useCallback((exerciseId: string) => {    setCompletedIds((prev) => {
      if (prev.has(exerciseId)) return prev
      const next = new Set(prev)
      next.add(exerciseId)
      writeToStorage(next)
      return next
    })
  }, [])

  const isCompleted = useCallback(
    (exerciseId: string) => completedIds.has(exerciseId),
    [completedIds]
  )

  const clearAll = useCallback(() => {
    setCompletedIds(new Set())
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore fallback
    }
  }, [])

  return { completedIds, markComplete, isCompleted, clearAll }
}