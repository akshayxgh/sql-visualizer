'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface RouteGuardProps {
  exerciseId: string
  children: React.ReactNode
}

export function RouteGuard({ exerciseId, children }: RouteGuardProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Define the chronological order of exercises matching their unique IDs
    const exerciseChronology = ['ex-001', 'ex-002', 'ex-003', 'ex-004', 'ex-005']
    const currentIdx = exerciseChronology.indexOf(exerciseId)

    // Rule: First exercise is always unlocked
    if (currentIdx <= 0) {
      setIsAuthorized(true)
      return
    }

    try {
      // Pull down the array of completed elements stored inside the browser session
      const rawProgress = localStorage.getItem('sqlviz_completed_exercises')
      const completedList = rawProgress ? JSON.parse(rawProgress) : []
      const completedSet = new Set<string>(Array.isArray(completedList) ? completedList : [])

      // Find the ID of the exercise right before this one
      const previousExerciseId = exerciseChronology[currentIdx - 1]

      // Guard Rule: If the user hasn't completed the previous step, deflect them immediately!
      if (!completedSet.has(previousExerciseId)) {
        router.replace('/learn')
      } else {
        setIsAuthorized(true)
      }
    } catch {
      // Fallback fallback rule for local storage restrictions
      router.replace('/learn')
    }
  }, [exerciseId, router])

  // Show a clean loading placeholder for a split-second while checking browser records
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <span className="text-xs font-mono text-neutral-500 tracking-widest animate-pulse uppercase">
          Verifying Course Progress...
        </span>
      </div>
    )
  }

  return <>{children}</>
}