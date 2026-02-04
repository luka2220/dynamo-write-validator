'use server'

import type { DynamoRequestData } from './types'

export async function ValidateDynamoRequest(request: DynamoRequestData) {
  try {
    console.log('Request -> ', request)
  } catch (error) {
    const isError = error instanceof Error
    console.error('An error ocurred in the ValidateFynamoRequest function: ', {
      error: isError ? error.message : error,
      stack: isError && error.stack,
    })
  }
}
