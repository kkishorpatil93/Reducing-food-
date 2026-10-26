import React from 'react'

/**
 * Accessible Skeleton loader component
 */
export default function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}) {
  const base = 'animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg'

  const variants = {
    text: 'h-4 w-full rounded',
    title: 'h-6 w-3/4 rounded-md',
    avatar: 'w-12 h-12 rounded-full shrink-0',
    circle: 'rounded-full',
    rect: 'w-full h-48 rounded-2xl',
    badge: 'h-5 w-16 rounded-full',
  }

  const items = Array.from({ length: count })

  return (
    <div className="space-y-2.5 w-full">
      {items.map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{ width, height }}
          className={`${base} ${variants[variant] || variants.text} ${className}`}
        />
      ))}
    </div>
  )
}

/**
 * Pre-composed Card Skeleton for Food and Dashboard items
 */
export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-charcoal rounded-2xl p-5 border border-gray-100 dark:border-gray-800 space-y-4">
      <Skeleton variant="rect" className="h-44" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton variant="badge" />
          <Skeleton variant="text" width="60px" />
        </div>
        <Skeleton variant="title" />
        <Skeleton variant="text" count={2} />
      </div>
      <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <Skeleton variant="avatar" className="w-8 h-8" />
        <Skeleton variant="text" width="90px" height="32px" className="rounded-xl" />
      </div>
    </div>
  )
}
