import type { Exercise } from '@/types/exercise'

export const exercise002: Exercise = {
  id: 'ex-002',
  slug: 'filter-by-department',
  title: 'Filter by department',
  description: 'Return only the employees who work in the Sales department. The other rows should disappear from the result.',
  difficulty: 'beginner',
  topics: ['WHERE'],
  tags: ['filtering', 'where', 'strings', 'equality'],
  learningObjectives: [
    'Understand that WHERE removes rows that do not match a condition',
    'Use string equality in a WHERE clause',
    'See visually which rows are filtered out',
  ],
  datasetId: 'employees',
  starterQuery: 'SELECT *\nFROM employees\n',
  hints: [
    { level: 1, text: 'Think about which SQL clause lets you keep only certain rows based on a condition.' },
    { level: 2, text: "The WHERE clause filters rows. You need to check if the department column equals 'Sales'." },
    { level: 3, text: "Add: WHERE department = 'Sales'" },
  ],
  expectedOutput: [
    { id: 1, name: 'Alice', department: 'Sales', salary: 52000 },
    { id: 2, name: 'Bob',   department: 'Sales', salary: 70000 },
    { id: 7, name: 'Grace', department: 'Sales', salary: 61000 },
  ],
  validationStrategy: 'row_match_unordered',
  canonicalSolution: "SELECT *\nFROM employees\nWHERE department = 'Sales'",
  nextExerciseId: 'ex-003',
}