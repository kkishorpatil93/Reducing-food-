import React from 'react'
import { PackageOpen } from 'lucide-react'
import Button from './Button'

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are no listings matching your criteria at this moment.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white/60 dark:bg-charcoal/60 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 my-4 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-cream-200 dark:bg-gray-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-heading font-semibold text-charcoal dark:text-cream-50 mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
