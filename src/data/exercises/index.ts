import { exercise001 } from './ex-001'
import { exercise002 } from './ex-002'
import { exercise003 } from './ex-003'
import { exercise004 } from './ex-004'
import { exercise005 } from './ex-005'
import { exercise006 } from './ex-006'
import { exercise007 } from './ex-007'
import { exercise008 } from './ex-008'
import type { Exercise } from '@/types/exercise'

export const ALL_EXERCISES: Exercise[] = [
  exercise001,
  exercise002,
  exercise003,
  exercise004,
  exercise005,
  exercise006,
  exercise007,
  exercise008,
]

export function getExerciseById(id: string): Exercise | null {
  return ALL_EXERCISES.find((ex) => ex.id === id) ?? null
}

export function getExerciseBySlug(slug: string): Exercise | null {
  return ALL_EXERCISES.find((ex) => ex.slug === slug) ?? null
}

export function getExerciseIndex(id: string): number {
  return ALL_EXERCISES.findIndex((ex) => ex.id === id)
}