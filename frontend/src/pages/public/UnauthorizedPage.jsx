import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react'
import Button from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'

export default function UnauthorizedPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white dark:bg-charcoal rounded-3xl p-8 border border-red-100 dark:border-red-900/40 shadow-soft space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
            Error 403 • Access Restricted
          </span>
          <h1 className="text-2xl font-heading font-bold text-charcoal dark:text-cream-50 mt-1">
            Permission Required
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
            Your current account ({user?.email || 'Guest'} with role <strong>{user?.role || 'None'}</strong>) does not have permission to view this section.
          </p>
        </div>

        <div className="p-3 bg-cream-50 dark:bg-gray-800/60 rounded-xl text-xs text-gray-500 border border-brand-100 dark:border-gray-700">
          Client-side route guards are for navigation convenience; the backend enforces real database access rules.
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          <Link to="/">
            <Button variant="primary" size="sm" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm">
              Switch Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
