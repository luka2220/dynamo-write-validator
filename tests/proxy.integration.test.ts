import { expect, test, beforeAll, afterAll } from 'bun:test'
import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { proxy } from '../proxy'

const TEST_DYNAMO_TABLE = 'TestSchemaValidator'

let server: ReturnType<typeof Bun.serve>
const TEST_PORT = 4567

beforeAll(() => {
  server = Bun.serve({
    port: TEST_PORT,
    fetch: async (request) => {
      const { NextRequest } = await import('next/server')
      const nextRequest = new NextRequest(request)
      return proxy(nextRequest)
    },
  })
})

afterAll(() => {
  server.stop()
})

const client = new DynamoDBClient({
  endpoint: `http://localhost:${TEST_PORT}`,
  region: 'us-east-1',
  tls: false,
})

test('GetItem through proxy to local DynamoDB', async () => {
  const command = new GetItemCommand({
    TableName: TEST_DYNAMO_TABLE,
    Key: { id: { S: 'test-key' } },
  })

  const response = await client.send(command)
  expect(response).toBeDefined()
})

test('Query through proxy to local DynamoDB', async () => {
  const command = new QueryCommand({
    TableName: TEST_DYNAMO_TABLE,
    KeyConditionExpression: 'id = :pk',
    ExpressionAttributeValues: { ':pk': { S: 'test-key' } },
  })

  const response = await client.send(command)
  expect(response).toBeDefined()
})

test('Invalid operation returns error response', async () => {
  const response = await fetch(`http://localhost:${TEST_PORT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-amz-target': 'DynamoDB_20120810.InvalidOperation',
      'x-amz-date': new Date().toISOString(),
    },
    body: JSON.stringify({ TableName: TEST_DYNAMO_TABLE }),
  })

  const text = await response.text()
  expect(text).toContain('Invalid dynamo operation')
})
