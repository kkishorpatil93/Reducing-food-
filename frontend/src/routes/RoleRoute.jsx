import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import UnauthorizedPage from '../pages/public/UnauthorizedPage'

/**
 * Route guard checking specific role authorizations
 * @param {Array<string>} allowedRoles - e.g. ['donor', 'restaurant']
 */
export default function RoleRoute({ allowedRoles = [], children }) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const hasRole = allowedRoles.includes(user?.role)

  if (!hasRole) {
    return <UnauthorizedPage />
  }

  return children ? children : <Outlet />
}
