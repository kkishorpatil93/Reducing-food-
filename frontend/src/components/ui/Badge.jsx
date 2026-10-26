import React from 'react'

/**
 * Reusable Badge for Statuses, Dietary Tags, and Categories
 */
export default function Badge({
  children,
  status,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) {
  // If a standard food status is supplied, map it to our designated status colors
  const statusStyles = {
    Available: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    Requested: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    Accepted: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    Collected: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    Expired: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800',
    Rejected: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  }

  const variantStyles = {
    primary: 'bg-brand-100 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 border-brand-200 dark:border-brand-800',
    accent: 'bg-accent-100 text-accent-800 dark:bg-accent-950/60 dark:text-accent-300 border-accent-200 dark:border-accent-800',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    danger: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800',
    neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
  }

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  }

  const dotColors = {
    Available: 'bg-emerald-500',
    Requested: 'bg-amber-500',
    Accepted: 'bg-blue-500',
    Collected: 'bg-purple-500',
    Expired: 'bg-gray-400',
    Cancelled: 'bg-red-500',
    Rejected: 'bg-rose-500',
  }

  const selectedStyle = status && statusStyles[status] ? statusStyles[status] : variantStyles[variant] || variantStyles.neutral
  const selectedDotColor = status && dotColors[status] ? dotColors[status] : 'bg-current'

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide transition-colors ${selectedStyle} ${sizes[size] || sizes.md} ${className}`}
    >
      {(dot || status) && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedDotColor} ${status === 'Available' ? 'animate-pulse' : ''}`} />
      )}
      <span>{children || status}</span>
    </span>
  )
}
