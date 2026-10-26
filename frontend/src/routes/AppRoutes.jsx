import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/public/HomePage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import UnauthorizedPage from '../pages/public/UnauthorizedPage'
import AddFoodPage from '../pages/donor/AddFoodPage'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'

// Phase Placeholders for verifying Route Guards
function DonorDonationsPlaceholder() {
  const { user } = useAuth()
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold">My Donations History</h2>
          <Badge status="Available">Authorized: {user?.role}</Badge>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          View all active, completed, and cancelled donations created by <strong>{user?.name}</strong>.
        </p>
        <div className="p-4 bg-brand-50 dark:bg-brand-950/40 rounded-xl text-xs text-brand-800 dark:text-brand-300 font-medium">
          Full My Donations table with status filters lands in Phase 8.
        </div>
      </Card>
    </div>
  )
}

function ReceiverDashboardPlaceholder() {
  const { user } = useAuth()
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold">Receiver & NGO Portal (Protected Role Route)</h2>
          <Badge status="Accepted">Authorized: {user?.role}</Badge>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          This route is restricted strictly to <strong>receiver</strong> and <strong>ngo</strong> roles.
        </p>
        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-xs text-blue-800 dark:text-blue-300 font-medium">
          ✓ Guard verified: Only verified community NGOs & receivers can request food here.
        </div>
      </Card>
    </div>
  )
}

function AdminDashboardPlaceholder() {
  const { user } = useAuth()
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold">Admin Moderation Queue (Protected Role Route)</h2>
          <Badge status="Collected">Authorized: {user?.role}</Badge>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          This route is restricted strictly to <strong>admin</strong> users.
        </p>
        <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-xl text-xs text-purple-800 dark:text-purple-300 font-medium">
          ✓ Guard verified: Platform moderation, user suspension, and dispute resolution.
        </div>
      </Card>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <Card className="max-w-md w-full p-8 space-y-4">
        <span className="text-4xl">🔍</span>
        <h2 className="text-2xl font-heading font-bold">Page Not Found</h2>
        <p className="text-xs text-gray-500">The page you requested could not be found.</p>
        <Button variant="primary" size="sm" onClick={() => window.location.href = '/'}>
          Return Home
        </Button>
      </Card>
    </div>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Donor & Restaurant Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['donor', 'restaurant']} />}>
          <Route path="/donor/add" element={<AddFoodPage />} />
          <Route path="/donor/donations" element={<DonorDonationsPlaceholder />} />
        </Route>

        {/* Protected Receiver & NGO Routes */}
        <Route element={<RoleRoute allowedRoles={['receiver', 'ngo']} />}>
          <Route path="/receiver/requests" element={<ReceiverDashboardPlaceholder />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<RoleRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboardPlaceholder />} />
          <Route path="/admin/users" element={<AdminDashboardPlaceholder />} />
          <Route path="/admin/reports" element={<AdminDashboardPlaceholder />} />
        </Route>
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
