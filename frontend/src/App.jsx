import React from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import OfflineBanner from './components/ui/OfflineBanner'
import DemoBanner from './components/ui/DemoBanner'
import AppRoutes from './routes/AppRoutes'

function MainLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 dark:bg-charcoal-dark text-charcoal dark:text-cream-50 transition-colors">
      <OfflineBanner />
      <DemoBanner />
      <Navbar user={user} onLogout={logout} />
      
      <main className="flex-1">
        <AppRoutes />
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
