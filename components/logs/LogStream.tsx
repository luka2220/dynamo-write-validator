'use client'

import { useState, useTransition } from 'react'
import { LogEntry as LogEntryType } from '@/lib/types'
import { LogEntry } from './LogEntry'
import { Button } from '@/components/ui/Button'
import { clearLogs } from '@/lib/log-actions'
import { useRouter } from 'next/navigation'

interface LogStreamProps {
  logs: LogEntryType[]
}

type FilterType = 'all' | 'success' | 'error'

export function LogStream({ logs }: LogStreamProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true
    return log.status === filter
  })

  const successCount = logs.filter((l) => l.status === 'success').length
  const errorCount = logs.filter((l) => l.status === 'error').length

  const handleClearLogs = () => {
    startTransition(async () => {
      const result = await clearLogs()

      if (!result.success) {
        console.error('An error occurred clearing the logs: ')
      }

      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={handleClearLogs}
          isLoading={isPending}
        >
          {isPending ? 'Processing' : 'Clear Logs'}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({logs.length})
          </Button>
          <Button
            variant={filter === 'success' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('success')}
          >
            Success ({successCount})
          </Button>
          <Button
            variant={filter === 'error' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('error')}
          >
            Errors ({errorCount})
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Live
        </div>
      </div>

      <div className="space-y-2">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            No logs to display
          </div>
        ) : (
          filteredLogs.map((log) => <LogEntry key={log.id} entry={log} />)
        )}
      </div>
    </div>
  )
}
