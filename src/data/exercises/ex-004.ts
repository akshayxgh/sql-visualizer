import type { Exercise } from '@/types/exercise'

export const exercise004: Exercise = {
  id: 'ex-004',
  slug: 'filter-and-sort',
  title: 'Filter and sort',
  description: 'Find all employees in the Sales department and sort them from highest to lowest salary. Two clauses working together.',
  difficulty: 'beginner',
  topics: ['WHERE', 'ORDER BY'],
  tags: ['filtering', 'sorting', 'where', 'order-by', 'combined'],
  learningObjectives: [
    'Combine WHERE and ORDER BY in a single query',
    'Understand that WHERE runs before ORDER BY',
    'See the two-stage transformation: filter first, then sort',
  ],
  datasetId: 'employees',
  starterQuery: 'SELECT *\nFROM employees\n',
  hints: [
    { level: 1, text: 'You need two clauses: one to keep only Sales employees, one to sort by salary.' },
    { level: 2, text: "Use WHERE to filter by department first, then ORDER BY salary. WHERE always comes before ORDER BY." },
    { level: 3, text: "Add: WHERE department = 'Sales' ORDER BY salary DESC" },
  ],
  expectedOutput: [
    { id: 2, name: 'Bob',   department: 'Sales', salary: 70000 },
    { id: 7, name: 'Grace', department: 'Sales', salary: 61000 },
    { id: 1, name: 'Alice', department: 'Sales', salary: 52000 },
  ],
  validationStrategy: 'exact_match',
  canonicalSolution: "SELECT *\nFROM employees\nWHERE department = 'Sales'\nORDER BY salary DESC",
  nextExerciseId: 'ex-005',
}