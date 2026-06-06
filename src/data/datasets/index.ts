import { employeesDataset } from './employees'
import type { Dataset } from '@/types/exercise'

const datasetRegistry: Record<string, Dataset> = {
  employees: employeesDataset,
}

export function getDataset(id: string): Dataset {
  const dataset = datasetRegistry[id]
  if (!dataset) {
    throw new Error(
      `Dataset "${id}" not found. Register it in src/data/datasets/index.ts`
    )
  }
  return dataset
}

export { employeesDataset }