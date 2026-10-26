import React from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
import Button from './Button'

export default function ErrorMessage({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this content. Please check your connection and try again.',
  onRetry,
  className = '',
}) {
  return (
    <div
      role="alert"
      className={`p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-charcoal dark:text-cream-50 ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-400 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">
            {title}
          </h4>
          <p className="text-xs text-red-700/80 dark:text-red-300/80 mt-1 max-w-lg leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950 shrink-0"
        >
          Try Again
        </Button>
      )}
    </div>
  )
}
