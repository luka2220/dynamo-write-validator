'use client'

import { useState } from 'react'
import {
  LogEntry as LogEntryType,
  isSuccessLogEntry,
  isErrorLogEntry,
} from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { LogDetails } from './LogDetails'

interface LogEntryProps {
  entry: LogEntryType
}

function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date

  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export function LogEntry({ entry }: LogEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const isSuccess = isSuccessLogEntry(entry)
  const isError = isErrorLogEntry(entry)

  return (
    <Card
      padding="none"
      hover={!isExpanded}
      onClick={() => setIsExpanded(!isExpanded)}
      className={`
        cursor-pointer transition-all duration-200
        ${isExpanded ? 'ring-1 ring-accent' : ''}
      `}
    >
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge variant={isSuccess ? 'success' : 'error'}>
              {isSuccess ? 'Success' : 'Error'}
            </Badge>
            <span className="font-medium text-text-primary">
              {entry.tableName}
            </span>
            <span className="text-sm text-text-secondary">
              {entry.operation}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isError && (
              <span className="text-sm text-error">
                {entry.errors.length} error
                {entry.errors.length !== 1 ? 's' : ''}
              </span>
            )}

            <span className="text-sm text-text-secondary font-mono">
              {formatTime(entry.timestamp)}
            </span>

            <button
              className={`
                p-1 rounded transition-transform duration-200
                ${isExpanded ? 'rotate-180' : ''}
              `}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <svg
                className="w-4 h-4 text-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {isExpanded && <LogDetails entry={entry} />}
      </div>
    </Card>
  )
}
