import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Skeleton from '../components/ui/Skeleton'

/**
 * Route guard requiring an authenticated user
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        <Skeleton variant="title" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children ? children : <Outlet />
}
