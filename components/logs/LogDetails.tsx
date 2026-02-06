import { LogEntry, isSuccessLogEntry, ValidationError } from '@/lib/types'
import { CodeBlock } from '@/components/ui/CodeBlock'

interface LogDetailsProps {
  entry: LogEntry
}

function ValidationErrorItem({ error }: { error: ValidationError }) {
  return (
    <div className="p-3 rounded-lg bg-error-bg border border-error/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-medium text-text-primary">
              {error.attributeName}
            </span>
          </div>

          <p className="text-sm text-text-secondary mb-2">{error.message}</p>
          <div className="flex gap-4 text-xs">
            <div>
              <span className="text-text-secondary">Expected: </span>
              <span className="font-mono text-success">
                {error.expectedType}
              </span>
            </div>

            <div>
              <span className="text-text-secondary">Received: </span>
              <span className="font-mono text-error">{error.receivedType}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-text-secondary">Value:</span>
          <div className="font-mono text-xs text-text-primary mt-0.5">
            {JSON.stringify(error.receivedValue)}
          </div>
        </div>
      </div>
    </div>
  )
}

export function LogDetails({ entry }: LogDetailsProps) {
  if (isSuccessLogEntry(entry)) {
    return (
      <div className="mt-3 pt-3 border-t border-border">
        <div className="mb-2">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
            Written Data
          </span>
        </div>
        <CodeBlock code={JSON.stringify(entry.data, null, 2)} />
      </div>
    )
  }

  return (
    <div className="mt-3 pt-3 border-t border-border">
      <div className="mb-3">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          Validation Errors ({entry.errors.length})
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {entry.errors.map((error, index) => (
          <ValidationErrorItem key={index} error={error} />
        ))}
      </div>

      <div className="mb-2">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          Attempted Data
        </span>
      </div>

      <CodeBlock code={JSON.stringify(entry.attemptedData, null, 2)} />
    </div>
  )
}
