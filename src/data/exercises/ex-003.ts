import type { Exercise } from '@/types/exercise'

export const exercise003: Exercise = {
  id: 'ex-003',
  slug: 'sort-by-salary',
  title: 'Sort by salary',
  description: 'Return all employees sorted from the highest salary to the lowest. No rows should be removed — only their order changes.',
  difficulty: 'beginner',
  topics: ['ORDER BY'],
  tags: ['sorting', 'order-by', 'descending', 'numbers'],
  learningObjectives: [
    'Understand that ORDER BY changes row order, not row count',
    'Use DESC to sort from highest to lowest',
    'See visually how rows rearrange position',
  ],
  datasetId: 'employees',
  starterQuery: 'SELECT *\nFROM employees\n',
  hints: [
    { level: 1, text: 'You need a clause that controls the order rows appear in. No rows should be removed.' },
    { level: 2, text: 'ORDER BY lets you sort results. Use DESC after the column name to sort highest first.' },
    { level: 3, text: 'Add: ORDER BY salary DESC' },
  ],
  expectedOutput: [
    { id: 5, name: 'Eva',   department: 'IT',      salary: 95000 },
    { id: 4, name: 'David', department: 'IT',      salary: 88000 },
    { id: 8, name: 'Henry', department: 'Finance', salary: 77000 },
    { id: 2, name: 'Bob',   department: 'Sales',   salary: 70000 },
    { id: 7, name: 'Grace', department: 'Sales',   salary: 61000 },
    { id: 1, name: 'Alice', department: 'Sales',   salary: 52000 },
    { id: 3, name: 'Carol', department: 'HR',      salary: 45000 },
    { id: 6, name: 'Frank', department: 'HR',      salary: 41000 },
  ],
  validationStrategy: 'exact_match',
  canonicalSolution: 'SELECT *\nFROM employees\nORDER BY salary DESC',
  nextExerciseId: 'ex-004',
}