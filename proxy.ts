import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { ValidateDynamoRequest } from './lib/dynamo'
import {
  DynamoRequestBody,
  DynamoOperationEnum,
  DynamoRequestData,
} from './lib/types'

const VALID_DYNAMO_API_VERSIONS = ['DynamoDB_20120810']

export async function proxy(request: NextRequest) {
  const target = request.headers.get('x-amz-target')

  const dynamoApiVersion = target?.split('.')[0]
  const dynamoApiOperation = target?.split('.')[1]
  const parsedOperation = DynamoOperationEnum.safeParse(dynamoApiOperation)

  if (
    target &&
    request.method == 'POST' &&
    VALID_DYNAMO_API_VERSIONS.includes(dynamoApiVersion || '')
  ) {
    if (parsedOperation.error) {
      // Invalid dynamo operation
      console.log(`Invalid dynamo operation: ${parsedOperation.error}`)
      return new Response(`Invalid dynamo operation: ${parsedOperation.error}`)
    }

    const body = (await request.json()) as DynamoRequestBody

    const dynamoData = {
      body: body,
      operation: parsedOperation.data,
      headers: {
        'content-length': request.headers.get('content-length') || '',
        'x-amz-target': target,
        'x-amz-date': request.headers.get('x-amz-date') || '',
      },
    } as DynamoRequestData

    const dynamoResponse = await ValidateDynamoRequest(dynamoData)
    return new Response(JSON.stringify(dynamoResponse))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
