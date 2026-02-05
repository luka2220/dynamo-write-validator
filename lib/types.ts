import * as z from 'zod'
import type {
  GetItemCommandInput,
  PutItemCommandInput,
  QueryCommandInput,
  DeleteItemCommandInput,
} from '@aws-sdk/client-dynamodb'

// DynamoDB attribute types
export type DynamoDBType =
  | 'S'
  | 'N'
  | 'B'
  | 'BOOL'
  | 'L'
  | 'M'
  | 'SS'
  | 'NS'
  | 'BS'
  | 'NULL'

// Key attribute types (only S, N, B allowed for keys)
export type KeyType = 'S' | 'N' | 'B'

// Operation types
export type OperationType = 'PutItem' | 'UpdateItem' | 'DeleteItem'

// Log status
export type LogStatus = 'success' | 'error'

// Validation error
export interface ValidationError {
  attributeName: string
  expectedType: string
  receivedType: string
  receivedValue: unknown
  message: string
}

// Base log entry
interface BaseLogEntry {
  id: string
  timestamp: Date
  tableName: string
  operation: OperationType
}

// Success log entry
export interface SuccessLogEntry extends BaseLogEntry {
  status: 'success'
  data: Record<string, unknown>
}

// Error log entry
export interface ErrorLogEntry extends BaseLogEntry {
  status: 'error'
  errors: ValidationError[]
  attemptedData: Record<string, unknown>
}

// Union type for log entries
export type LogEntry = SuccessLogEntry | ErrorLogEntry

// Schema attribute
export interface SchemaAttribute {
  name: string
  type: DynamoDBType
  required: boolean
}

// Key definition
export interface KeyDefinition {
  name: string
  type: KeyType
}

// Table schema
export interface TableSchema {
  id: string
  tableName: string
  partitionKey: KeyDefinition
  sortKey?: KeyDefinition
  attributes: SchemaAttribute[]
}

// Type guards
export function isSuccessLogEntry(entry: LogEntry): entry is SuccessLogEntry {
  return entry.status === 'success'
}

export function isErrorLogEntry(entry: LogEntry): entry is ErrorLogEntry {
  return entry.status === 'error'
}

export const DynamoOperationEnum = z.enum([
  'PutItem',
  'GetItem',
  'Query',
  'UpdateItem',
  'DeleteItem',
])

/** Union of all valid db operations the schema validator supports */
export type ValidDynamoOperation = z.infer<typeof DynamoOperationEnum>

/** Union of all possible dynamo typescript types */
export type DynamoAttributeValue =
  | string
  | number
  | Buffer
  | Uint8Array
  | boolean
  | null
  | Set<string>
  | Set<number>
  | Set<Uint8Array | Buffer>
  | DynamoAttributeValue[]
  | { [key: string]: DynamoAttributeValue }

/** Union of all dynamo request body types */
export type DynamoRequestBody =
  | PutItemCommandInput
  | GetItemCommandInput
  | QueryCommandInput
  | DeleteItemCommandInput

/** Header data dynamo sends along with the db request */
export interface DynamoHeaderData {
  'content-length': string
  'x-amz-target': string
  'x-amz-date': string
}

interface DynamoRequestDataBase {
  headers: DynamoHeaderData
}

export interface DynamoPutItemRequest extends DynamoRequestDataBase {
  operation: 'PutItem' | 'UpdateItem'
  body: PutItemCommandInput
}

export interface DynamoGetItemRequest extends DynamoRequestDataBase {
  operation: 'GetItem'
  body: GetItemCommandInput
}

export interface DynamoQueryRequest extends DynamoRequestDataBase {
  operation: 'Query'
  body: QueryCommandInput
}

export interface DynamoDeleteItemRequest extends DynamoRequestDataBase {
  operation: 'DeleteItem'
  body: DeleteItemCommandInput
}

export type DynamoRequestData =
  | DynamoPutItemRequest
  | DynamoGetItemRequest
  | DynamoQueryRequest
  | DynamoDeleteItemRequest
