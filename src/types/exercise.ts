export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Hint {
  level: 1 | 2 | 3
  text: string
}

export interface Column {
  name: string
  type: 'INTEGER' | 'TEXT' | 'REAL'
  isPrimaryKey: boolean
}

export interface Dataset {
  id: string
  displayName: string
  description: string
  columns: Column[]
  seedSql: string
}

export interface ExpectedOutputRow {
  [columnName: string]: string | number | null
}

export type ValidationStrategy = 'exact_match' | 'row_match_unordered'

export interface Exercise {
  id: string
  slug: string
  title: string
  description: string
  difficulty: Difficulty
  topics: string[]
  tags: string[]
  learningObjectives: string[]
  datasetId: string
  starterQuery: string
  hints: Hint[]
  expectedOutput: ExpectedOutputRow[]
  validationStrategy: ValidationStrategy
  canonicalSolution: string
  nextExerciseId: string | null
}