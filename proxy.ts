import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { ValidateDynamoRequest } from './lib/dynamo'
import { DynamoRequestBody, DynamoOperationEnum } from './lib/types'

const VALID_DYNAMO_API_VERSIONS = ['DynamoDB_20120810']

export async function proxy(request: NextRequest) {
  const target = request.headers.get('x-amz-target')
  const body = (await request.json()) as DynamoRequestBody

  const dynamoApiVersion = target?.split('.')[0]
  const dynamoApiOperation = target?.split('.')[1]
  const parsedOperation = DynamoOperationEnum.safeParse(dynamoApiOperation)

  console.log('Headers -> ', request.headers)
  console.log('Target -> ', target)
  console.log('Body -> ', body)

  if (
    target &&
    request.method == 'POST' &&
    VALID_DYNAMO_API_VERSIONS.includes(dynamoApiVersion || '') &&
    parsedOperation.success
  ) {
    const dynamoData = {
      body: body,
      operation: parsedOperation.data,
      headers: {
        'content-length': request.headers.get('content-length') || '',
        'x-amz-target': target,
        'x-amz-date': request.headers.get('x-amx-date') || '',
      },
    }
    await ValidateDynamoRequest(dynamoData)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
