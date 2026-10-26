import React from 'react'
import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

export default function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-red-600 text-white font-medium text-xs sm:text-sm px-4 py-2 flex items-center justify-center gap-2 select-none z-50 sticky top-0 shadow-md animate-bounce"
    >
      <WifiOff className="w-4 h-4" />
      <span>
        <strong>You are offline:</strong> Please check your internet connection. Some actions may be unavailable.
      </span>
    </div>
  )
}
