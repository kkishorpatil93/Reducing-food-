import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/public/HomePage'
import BrowseFoodPage from '../pages/public/BrowseFoodPage'
import FoodDetailsPage from '../pages/public/FoodDetailsPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import UnauthorizedPage from '../pages/public/UnauthorizedPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import AddFoodPage from '../pages/donor/AddFoodPage'
import MyDonationsPage from '../pages/donor/MyDonationsPage'
import MyRequestsPage from '../pages/receiver/MyRequestsPage'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'

// Admin Placeholders for verifying Route Guards
function AdminDashboardPlaceholder() {
  const { user } = useAuth()
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold">Admin Moderation Queue</h2>
          <Badge status="Collected">Authorized: {user?.role}</Badge>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Platform moderation, user block/unblock, and disputes resolution panel. Lands in Phase 11.
        </p>
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
      <Route path="/browse" element={<BrowseFoodPage />} />
      <Route path="/foods/:id" element={<FoodDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected General Dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Protected Donor & Restaurant Routes */}
        <Route element={<RoleRoute allowedRoles={['donor', 'restaurant']} />}>
          <Route path="/donor/add" element={<AddFoodPage />} />
          <Route path="/donor/donations" element={<MyDonationsPage />} />
        </Route>

        {/* Protected Receiver & NGO Routes */}
        <Route element={<RoleRoute allowedRoles={['receiver', 'ngo']} />}>
          <Route path="/receiver/requests" element={<MyRequestsPage />} />
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
