import type { Dataset } from '@/types/exercise'

export const employeesDataset: Dataset = {
  id: 'employees',
  displayName: 'Employees',
  description: 'A company employee table with name, department, and salary data.',
  columns: [
    { name: 'id',         type: 'INTEGER', isPrimaryKey: true  },
    { name: 'name',       type: 'TEXT',    isPrimaryKey: false },
    { name: 'department', type: 'TEXT',    isPrimaryKey: false },
    { name: 'salary',     type: 'INTEGER', isPrimaryKey: false },
  ],
  seedSql: `
    CREATE TABLE employees (
      id         INTEGER PRIMARY KEY,
      name       TEXT    NOT NULL,
      department TEXT    NOT NULL,
      salary     INTEGER NOT NULL
    );
    INSERT INTO employees VALUES (1, 'Alice',   'Sales',   52000);
    INSERT INTO employees VALUES (2, 'Bob',     'Sales',   70000);
    INSERT INTO employees VALUES (3, 'Carol',   'HR',      45000);
    INSERT INTO employees VALUES (4, 'David',   'IT',      88000);
    INSERT INTO employees VALUES (5, 'Eva',     'IT',      95000);
    INSERT INTO employees VALUES (6, 'Frank',   'HR',      41000);
    INSERT INTO employees VALUES (7, 'Grace',   'Sales',   61000);
    INSERT INTO employees VALUES (8, 'Henry',   'Finance', 77000);
  `,
}