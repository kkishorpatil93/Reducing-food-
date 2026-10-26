import React from 'react'
import { Database, AlertTriangle } from 'lucide-react'

export default function DemoBanner() {
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

  if (!useMocks) return null

  return (
    <div
      role="banner"
      className="bg-amber-500 text-amber-950 font-semibold text-xs px-4 py-1.5 flex items-center justify-center gap-2 select-none shadow-sm z-40"
    >
      <Database className="w-3.5 h-3.5" />
      <span>
        <strong>DEMO DATA ACTIVE</strong> – Frontend is running in development mock mode. All changes are local.
      </span>
    </div>
  )
}
