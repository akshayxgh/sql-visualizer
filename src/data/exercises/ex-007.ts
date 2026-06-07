import type { Exercise } from '@/types/exercise'

export const exercise007: Exercise = {
  id: 'ex-007',
  slug: 'average-salary-by-department',
  title: 'Average salary by department',
  description: 'Find the average salary in each department. Use AVG() to aggregate numeric values within groups.',
  difficulty: 'intermediate',
  topics: ['GROUP BY'],
  tags: ['grouping', 'aggregate', 'avg', 'numbers'],
  learningObjectives: [
    'Use AVG() to compute a mean value within each group',
    'Understand that aggregate functions reduce many rows to one value',
  ],
  datasetId: 'employees',
  starterQuery: 'SELECT department, AVG(salary) AS avg_salary\nFROM employees\n',
  hints: [
    { level: 1, text: 'You need one row per department showing the average salary.' },
    { level: 2, text: 'AVG(salary) computes the average salary within each group.' },
    { level: 3, text: 'Add: GROUP BY department' },
  ],
  expectedOutput: [
    { department: 'Finance', avg_salary: 77000 },
    { department: 'HR',      avg_salary: 43000 },
    { department: 'IT',      avg_salary: 91500 },
    { department: 'Sales',   avg_salary: 61000 },
  ],
  validationStrategy: 'row_match_unordered',
  canonicalSolution: 'SELECT department, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department',
  nextExerciseId: 'ex-008',
}