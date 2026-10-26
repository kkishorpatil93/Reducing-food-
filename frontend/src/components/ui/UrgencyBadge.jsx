import React from 'react'
import { Clock, AlertTriangle } from 'lucide-react'

/**
 * UrgencyBadge: Highlights listings expiring within 2 hours
 * @param {string | Date} expiryTime - ISO string or Date
 * @param {number} hoursLeft - Optional direct hours left
 */
export default function UrgencyBadge({ expiryTime, hoursLeft, className = '' }) {
  let remainingHours = hoursLeft

  if (remainingHours === undefined && expiryTime) {
    const diffMs = new Date(expiryTime).getTime() - Date.now()
    remainingHours = diffMs / (1000 * 60 * 60)
  }

  // Not urgent if more than 2 hours or invalid
  if (remainingHours === undefined || remainingHours > 2) {
    if (remainingHours > 2) {
      const hours = Math.floor(remainingHours)
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium ${className}`}>
          <Clock className="w-3.5 h-3.5" />
          <span>{hours}h left</span>
        </span>
      )
    }
    return null
  }

  // Expired
  if (remainingHours <= 0) {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700 ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-gray-500" />
        <span>Expired</span>
      </span>
    )
  }

  // Under 2 hours: Urgent highlight
  const totalMinutes = Math.floor(remainingHours * 60)
  const displayTime = totalMinutes < 60 ? `${totalMinutes}m` : `1h ${totalMinutes - 60}m`

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 shadow-sm animate-pulse ${className}`}
      title="Expires in less than 2 hours"
    >
      <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
      <span>Urgent: {displayTime} left</span>
    </span>
  )
}
