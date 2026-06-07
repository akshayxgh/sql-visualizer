import type { Exercise } from '@/types/exercise'

export const exercise006: Exercise = {
  id: 'ex-006',
  slug: 'count-by-department',
  title: 'Count employees per department',
  description: 'Group employees by department and count how many are in each one. This is GROUP BY in its most basic form.',
  difficulty: 'intermediate',
  topics: ['GROUP BY'],
  tags: ['grouping', 'aggregate', 'count'],
  learningObjectives: [
    'Understand that GROUP BY collapses multiple rows into one row per group',
    'Use COUNT(*) to count rows within each group',
    'See visually how source rows collapse into group buckets',
  ],
  datasetId: 'employees',
  starterQuery: 'SELECT department, COUNT(*) AS employee_count\nFROM employees\n',
  hints: [
    { level: 1, text: 'You need to collapse rows that share the same department into a single summary row.' },
    { level: 2, text: 'GROUP BY groups rows by a column value. COUNT(*) counts how many rows are in each group.' },
    { level: 3, text: 'Add: GROUP BY department' },
  ],
  expectedOutput: [
    { department: 'Sales',   employee_count: 3 },
    { department: 'HR',      employee_count: 2 },
    { department: 'IT',      employee_count: 2 },
    { department: 'Finance', employee_count: 1 },
  ],
  validationStrategy: 'row_match_unordered',
  canonicalSolution: 'SELECT department, COUNT(*) AS employee_count\nFROM employees\nGROUP BY department',
  nextExerciseId: 'ex-007',
}