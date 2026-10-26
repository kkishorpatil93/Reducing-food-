import React from 'react'

export default function Card({
  children,
  className = '',
  hoverEffect = false,
  onClick,
  as: Component = 'div',
  ...props
}) {
  const hoverStyles = hoverEffect
    ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-soft-hover cursor-pointer'
    : ''

  return (
    <Component
      onClick={onClick}
      className={`bg-white dark:bg-charcoal text-charcoal dark:text-cream-50 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800/80 p-6 ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={`mb-4 flex items-center justify-between gap-4 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-lg font-heading font-semibold text-charcoal dark:text-cream-50 ${className}`}>{children}</h3>
}

export function CardDescription({ children, className = '' }) {
  return <p className={`text-sm text-gray-500 dark:text-gray-400 mt-1 ${className}`}>{children}</p>
}

export function CardContent({ children, className = '' }) {
  return <div className={`space-y-4 ${className}`}>{children}</div>
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 ${className}`}>
      {children}
    </div>
  )
}
