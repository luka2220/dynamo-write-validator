'use server'

import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb'
import type { DynamoRequestData } from './types'

const dynamoClient = new DynamoDBClient({
  region: 'us-east-1',
})

export async function ValidateDynamoRequest(request: DynamoRequestData) {
  try {
    switch (request.operation) {
      case 'GetItem': {
        return await GetItem(request.body)
      }
      case 'Query': {
        return await Query(request.body)
      }
      case 'PutItem':
      case 'UpdateItem':
      case 'DeleteItem':
      default:
        throw new Error(`Invalid dynamo operation: ${request.operation}`)
    }
  } catch (error) {
    const isError = error instanceof Error
    console.error('An error ocurred in the ValidateFynamoRequest function: ', {
      error: isError ? error.message : error,
      stack: isError && error.stack,
    })

    throw error
  }
}

async function GetItem(body: GetItemCommandInput) {
  const command = new GetItemCommand(body)
  return await dynamoClient.send(command)
}

async function Query(body: QueryCommandInput) {
  const command = new QueryCommand(body)
  return await dynamoClient.send(command)
}
