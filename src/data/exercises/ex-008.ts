import type { Exercise } from '@/types/exercise'

export const exercise008: Exercise = {
  id: 'ex-008',
  slug: 'having-filter-groups',
  title: 'Filter groups with HAVING',
  description: 'Find departments with more than one employee. WHERE filters rows before grouping — HAVING filters groups after aggregation.',
  difficulty: 'intermediate',
  topics: ['GROUP BY', 'HAVING'],
  tags: ['grouping', 'having', 'aggregate', 'filtering'],
  learningObjectives: [
    'Understand that HAVING filters groups, not rows',
    'Know that WHERE runs before GROUP BY, HAVING runs after',
    'See visually which groups survive HAVING and which are removed',
  ],
  datasetId: 'employees',
  starterQuery: 'SELECT department, COUNT(*) AS employee_count\nFROM employees\n',
  hints: [
    { level: 1, text: "You can't use WHERE to filter by COUNT(*) — WHERE runs before grouping happens." },
    { level: 2, text: 'HAVING filters groups based on an aggregate condition.' },
    { level: 3, text: 'Add: GROUP BY department HAVING COUNT(*) > 1' },
  ],
  expectedOutput: [
    { department: 'Sales', employee_count: 3 },
    { department: 'HR',    employee_count: 2 },
    { department: 'IT',    employee_count: 2 },
  ],
  validationStrategy: 'row_match_unordered',
  canonicalSolution: 'SELECT department, COUNT(*) AS employee_count\nFROM employees\nGROUP BY department\nHAVING COUNT(*) > 1',
  nextExerciseId: null,
}