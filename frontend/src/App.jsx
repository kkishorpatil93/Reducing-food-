import React from 'react'
import { Link } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import OfflineBanner from './components/ui/OfflineBanner'
import DemoBanner from './components/ui/DemoBanner'
import Card from './components/ui/Card'
import Button from './components/ui/Button'
import Badge from './components/ui/Badge'
import AppRoutes from './routes/AppRoutes'
import { Shield, UserCheck, Lock, ArrowRight, Utensils, HeartHandshake, ShieldAlert } from 'lucide-react'

function AuthPlaygroundHome() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Phase 4 Header */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-3xl p-8 shadow-soft relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
            <Shield className="w-3.5 h-3.5 text-accent-300" />
            <span>Phase 4: Authentication & Route Protection</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">
            Role-Based Authentication
          </h1>
          <p className="text-brand-100 text-sm leading-relaxed">
            Multi-role registration, login with client-side validation, password reveal toggle, in-memory auth state,
            and strict <code>ProtectedRoute</code> &amp; <code>RoleRoute</code> guards.
          </p>
        </div>
      </section>

      {/* Active Session Status Box */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg uppercase shadow-sm ${
              isAuthenticated
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
            }`}>
              {user?.name ? user.name[0] : 'G'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-heading font-bold text-charcoal dark:text-cream-50">
                  {isAuthenticated ? user.name : 'Guest User'}
                </h3>
                <Badge status={isAuthenticated ? 'Available' : 'Expired'} size="sm">
                  {isAuthenticated ? `ROLE: ${user.role.toUpperCase()}` : 'NOT SIGNED IN'}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {isAuthenticated
                  ? `Authenticated as ${user.email} (${user.organizationName || 'Individual'})`
                  : 'You are browsing as an unauthenticated guest. Sign in to test protected portals.'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {isAuthenticated ? (
              <Button variant="danger" size="sm" onClick={logout}>
                Log Out
              </Button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register New Account
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Route Guard Verification Testing Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold">Interactive Route Guard Testing</h2>
          <span className="text-xs text-gray-500">Click below to test protected paths</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Donor Route Card */}
          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-charcoal dark:text-cream-50">Donor / Restaurant Route</h3>
                <span className="text-[11px] text-gray-500">Path: <code>/donor/donations</code></span>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Guards listings creation and donor inventory. Only accessible by <code>restaurant</code> or <code>donor</code> roles.
            </p>
            <Link to="/donor/donations" className="block">
              <Button variant="outline" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Test Donor Guard
              </Button>
            </Link>
          </Card>

          {/* Receiver Route Card */}
          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-charcoal dark:text-cream-50">NGO / Receiver Route</h3>
                <span className="text-[11px] text-gray-500">Path: <code>/receiver/requests</code></span>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Guards collection requests history and status confirmation. Only accessible by <code>receiver</code> or <code>ngo</code>.
            </p>
            <Link to="/receiver/requests" className="block">
              <Button variant="outline" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Test Receiver Guard
              </Button>
            </Link>
          </Card>

          {/* Admin Route Card */}
          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-charcoal dark:text-cream-50">Admin Moderation Route</h3>
                <span className="text-[11px] text-gray-500">Path: <code>/admin</code></span>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Guards platform user moderation, listing take-down, and dispute resolution. Only accessible by <code>admin</code>.
            </p>
            <Link to="/admin" className="block">
              <Button variant="outline" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Test Admin Guard
              </Button>
            </Link>
          </Card>

        </div>
      </section>

      {/* Security Best Practices Reminder */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
        <Lock className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Frontend Security Notice for Developers:</p>
          <p className="leading-relaxed">
            Tokens are held strictly in application memory. No passwords or secret keys exist in the frontend code.
            Client route guards provide clean UX, but the backend is the real authority for database and API permission enforcement.
          </p>
        </div>
      </div>

    </div>
  )
}

function MainLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 dark:bg-charcoal-dark text-charcoal dark:text-cream-50 transition-colors">
      <OfflineBanner />
      <DemoBanner />
      <Navbar user={user} onLogout={logout} />
      
      <main className="flex-1">
        <AppRoutes defaultHomeComponent={<AuthPlaygroundHome />} />
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
