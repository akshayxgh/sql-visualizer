import type { Exercise } from '@/types/exercise'

export const exercise005: Exercise = {
  id: 'ex-005',
  slug: 'select-columns',
  title: 'Select specific columns',
  description: 'Return only the name and salary columns for all employees. SELECT * gives you everything — but you can ask for exactly what you need.',
  difficulty: 'beginner',
  topics: ['SELECT'],
  tags: ['select', 'columns', 'projection'],
  learningObjectives: [
    'Understand that SELECT controls which columns appear in the result',
    'Use a column list instead of * to project specific fields',
    'See that column selection changes the shape of the result, not the rows',
  ],
  datasetId: 'employees',
  starterQuery: 'SELECT *\nFROM employees',
  hints: [
    { level: 1, text: "Instead of *, list only the columns you want. You're selecting a subset of the available columns." },
    { level: 2, text: 'Replace * with the column names separated by a comma: name, salary' },
    { level: 3, text: 'Write: SELECT name, salary FROM employees' },
  ],
  expectedOutput: [
    { name: 'Alice', salary: 52000 },
    { name: 'Bob',   salary: 70000 },
    { name: 'Carol', salary: 45000 },
    { name: 'David', salary: 88000 },
    { name: 'Eva',   salary: 95000 },
    { name: 'Frank', salary: 41000 },
    { name: 'Grace', salary: 61000 },
    { name: 'Henry', salary: 77000 },
  ],
  validationStrategy: 'exact_match',
  canonicalSolution: 'SELECT name, salary\nFROM employees',
  nextExerciseId: null,
}