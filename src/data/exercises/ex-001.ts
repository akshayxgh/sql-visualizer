import type { Exercise } from '@/types/exercise'

export const exercise001: Exercise = {
  id: 'ex-001',
  slug: 'select-all',
  title: 'Select everything',
  description: 'Retrieve every row and every column from the employees table. This is the foundation of all SQL queries.',
  difficulty: 'beginner',
  topics: ['SELECT'],
  tags: ['select', 'basics', 'full-table'],
  learningObjectives: [
    'Understand that SELECT determines which columns to return',
    'Use * to select all columns',
    'Use FROM to specify which table to read from',
  ],
  datasetId: 'employees',
  starterQuery: 'SELECT *\nFROM employees',
  hints: [
    { level: 1, text: 'Every SQL query starts with SELECT. The * symbol means "all columns".' },
    { level: 2, text: 'After SELECT *, use FROM to tell SQL which table to read from.' },
    { level: 3, text: 'The complete query is: SELECT * FROM employees' },
  ],
  expectedOutput: [
    { id: 1, name: 'Alice',   department: 'Sales',   salary: 52000 },
    { id: 2, name: 'Bob',     department: 'Sales',   salary: 70000 },
    { id: 3, name: 'Carol',   department: 'HR',      salary: 45000 },
    { id: 4, name: 'David',   department: 'IT',      salary: 88000 },
    { id: 5, name: 'Eva',     department: 'IT',      salary: 95000 },
    { id: 6, name: 'Frank',   department: 'HR',      salary: 41000 },
    { id: 7, name: 'Grace',   department: 'Sales',   salary: 61000 },
    { id: 8, name: 'Henry',   department: 'Finance', salary: 77000 },
  ],
  validationStrategy: 'exact_match',
  canonicalSolution: 'SELECT *\nFROM employees',
  nextExerciseId: 'ex-002',
}