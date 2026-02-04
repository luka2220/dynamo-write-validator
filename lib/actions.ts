'use server'

import type { TableSchema } from './types'

// NOTE: Server actions should only be used for mutations, not data fetching

/** Stores a new table schema */
export async function storeSchema(schema: TableSchema) {
  console.info('Storing schema: ', schema)

  return {
    success: true,
    message: 'Schema stored successfully',
  }
}
