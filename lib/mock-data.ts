import { LogEntry, TableSchema } from './types'

// Mock log entries
export const mockLogs: LogEntry[] = [
    {
        id: '1',
        timestamp: new Date('2026-01-25T10:30:00'),
        tableName: 'Users',
        operation: 'PutItem',
        status: 'success',
        data: {
            userId: { S: 'user-123' },
            email: { S: 'john@example.com' },
            name: { S: 'John Doe' },
            age: { N: '28' },
            isActive: { BOOL: true },
        },
    },
    {
        id: '2',
        timestamp: new Date('2026-01-25T10:29:45'),
        tableName: 'Orders',
        operation: 'PutItem',
        status: 'error',
        errors: [
            {
                attributeName: 'totalAmount',
                expectedType: 'N',
                receivedType: 'S',
                receivedValue: '99.99',
                message: 'Expected type N (Number) but received S (String)',
            },
            {
                attributeName: 'quantity',
                expectedType: 'N',
                receivedType: 'BOOL',
                receivedValue: true,
                message: 'Expected type N (Number) but received BOOL (Boolean)',
            },
        ],
        attemptedData: {
            orderId: { S: 'order-456' },
            userId: { S: 'user-123' },
            totalAmount: { S: '99.99' },
            quantity: { BOOL: true },
        },
    },
    {
        id: '3',
        timestamp: new Date('2026-01-25T10:29:30'),
        tableName: 'Products',
        operation: 'UpdateItem',
        status: 'success',
        data: {
            productId: { S: 'prod-789' },
            name: { S: 'Wireless Headphones' },
            price: { N: '149.99' },
            inStock: { BOOL: true },
            tags: { SS: ['electronics', 'audio', 'wireless'] },
        },
    },
    {
        id: '4',
        timestamp: new Date('2026-01-25T10:29:15'),
        tableName: 'Sessions',
        operation: 'PutItem',
        status: 'error',
        errors: [
            {
                attributeName: 'expiresAt',
                expectedType: 'N',
                receivedType: 'S',
                receivedValue: '2026-01-26T10:29:15Z',
                message:
                    'Expected type N (Number for Unix timestamp) but received S (String)',
            },
        ],
        attemptedData: {
            sessionId: { S: 'sess-abc' },
            userId: { S: 'user-123' },
            expiresAt: { S: '2026-01-26T10:29:15Z' },
        },
    },
    {
        id: '5',
        timestamp: new Date('2026-01-25T10:29:00'),
        tableName: 'Users',
        operation: 'UpdateItem',
        status: 'success',
        data: {
            userId: { S: 'user-456' },
            email: { S: 'jane@example.com' },
            name: { S: 'Jane Smith' },
            age: { N: '32' },
            isActive: { BOOL: true },
            preferences: {
                M: {
                    theme: { S: 'dark' },
                    notifications: { BOOL: true },
                },
            },
        },
    },
    {
        id: '6',
        timestamp: new Date('2026-01-25T10:28:45'),
        tableName: 'Inventory',
        operation: 'PutItem',
        status: 'error',
        errors: [
            {
                attributeName: 'count',
                expectedType: 'N',
                receivedType: 'NULL',
                receivedValue: null,
                message: 'Expected type N (Number) but received NULL',
            },
            {
                attributeName: 'warehouseId',
                expectedType: 'S',
                receivedType: 'N',
                receivedValue: 12345,
                message: 'Expected type S (String) but received N (Number)',
            },
            {
                attributeName: 'lastUpdated',
                expectedType: 'N',
                receivedType: 'S',
                receivedValue: 'yesterday',
                message:
                    'Expected type N (Number for Unix timestamp) but received S (String)',
            },
        ],
        attemptedData: {
            inventoryId: { S: 'inv-001' },
            productId: { S: 'prod-789' },
            count: { NULL: true },
            warehouseId: { N: '12345' },
            lastUpdated: { S: 'yesterday' },
        },
    },
    {
        id: '7',
        timestamp: new Date('2026-01-25T10:28:30'),
        tableName: 'AuditLogs',
        operation: 'PutItem',
        status: 'success',
        data: {
            logId: { S: 'audit-001' },
            action: { S: 'USER_LOGIN' },
            userId: { S: 'user-123' },
            timestamp: { N: '1737801510' },
            metadata: {
                M: {
                    ip: { S: '192.168.1.1' },
                    userAgent: { S: 'Mozilla/5.0' },
                },
            },
        },
    },
    {
        id: '8',
        timestamp: new Date('2026-01-25T10:28:15'),
        tableName: 'Products',
        operation: 'DeleteItem',
        status: 'success',
        data: {
            productId: { S: 'prod-old-001' },
        },
    },
]

// Mock table schemas
export const mockSchemas: TableSchema[] = [
    {
        id: '1',
        tableName: 'Users',
        partitionKey: { name: 'userId', type: 'S' },
        attributes: [
            { name: 'email', type: 'S', required: true },
            { name: 'name', type: 'S', required: true },
            { name: 'age', type: 'N', required: false },
            { name: 'isActive', type: 'BOOL', required: true },
            { name: 'preferences', type: 'M', required: false },
        ],
    },
    {
        id: '2',
        tableName: 'Orders',
        partitionKey: { name: 'orderId', type: 'S' },
        sortKey: { name: 'createdAt', type: 'N' },
        attributes: [
            { name: 'userId', type: 'S', required: true },
            { name: 'totalAmount', type: 'N', required: true },
            { name: 'quantity', type: 'N', required: true },
            { name: 'status', type: 'S', required: true },
            { name: 'items', type: 'L', required: true },
        ],
    },
    {
        id: '3',
        tableName: 'Products',
        partitionKey: { name: 'productId', type: 'S' },
        attributes: [
            { name: 'name', type: 'S', required: true },
            { name: 'price', type: 'N', required: true },
            { name: 'inStock', type: 'BOOL', required: true },
            { name: 'tags', type: 'SS', required: false },
            { name: 'description', type: 'S', required: false },
        ],
    },
    {
        id: '4',
        tableName: 'Sessions',
        partitionKey: { name: 'sessionId', type: 'S' },
        attributes: [
            { name: 'userId', type: 'S', required: true },
            { name: 'expiresAt', type: 'N', required: true },
            { name: 'data', type: 'M', required: false },
        ],
    },
]

// DynamoDB type labels for display
export const dynamoDBTypeLabels: Record<string, string> = {
    S: 'String',
    N: 'Number',
    B: 'Binary',
    BOOL: 'Boolean',
    L: 'List',
    M: 'Map',
    SS: 'String Set',
    NS: 'Number Set',
    BS: 'Binary Set',
    NULL: 'Null',
}
