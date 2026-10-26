import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sprout, Sun, Moon, Menu, X, Bell, PlusCircle, User } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useNotifications } from '../../hooks/useNotifications'
import Button from '../ui/Button'

export default function Navbar({ user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()

  // Safely read unread notifications count
  let unreadCount = 0
  try {
    const notif = useNotifications()
    unreadCount = notif.unreadCount
  } catch {
    // If not in NotificationProvider, fallback to 0
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Browse Food', path: '/browse' },
    { label: 'Statistics', path: '/statistics' },
  ]

  // Add role-specific navigation link if user is logged in
  const roleDashboardLink = user?.role === 'donor' || user?.role === 'restaurant'
    ? { label: 'My Donations', path: '/donor/donations' }
    : user?.role === 'ngo' || user?.role === 'receiver'
    ? { label: 'My Requests', path: '/receiver/requests' }
    : user?.role === 'admin'
    ? { label: 'Admin Moderation', path: '/admin' }
    : null

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-brand-100/60 dark:border-gray-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl tracking-tight text-charcoal dark:text-cream-50 leading-none">
                FoodSave<span className="text-brand-600 dark:text-brand-400">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-accent-500 dark:text-accent-400">
                Rescue • Share • Nourish
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-brand-700 dark:text-brand-300 bg-brand-50/80 dark:bg-brand-950/40 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-50/50 dark:hover:bg-gray-800/40'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {roleDashboardLink && (
              <Link
                to={roleDashboardLink.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive(roleDashboardLink.path)
                    ? 'text-brand-700 dark:text-brand-300 bg-brand-50/80 dark:bg-brand-950/40 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400'
                }`}
              >
                {roleDashboardLink.label}
              </Link>
            )}
          </nav>

          {/* Right Actions: Theme Toggle, Notifications, Auth CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Dark/Light mode toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2.5 rounded-xl text-gray-500 hover:text-charcoal dark:text-gray-400 dark:hover:text-cream-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {(user.role === 'donor' || user.role === 'restaurant') && (
                  <Link to="/donor/add">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<PlusCircle className="w-4 h-4" />}
                    >
                      Donate Food
                    </Button>
                  </Link>
                )}

                <Link
                  to="/notifications"
                  aria-label={`View notifications (${unreadCount} unread)`}
                  className="relative p-2.5 rounded-xl text-gray-500 hover:text-charcoal dark:text-gray-400 dark:hover:text-cream-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-charcoal">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Profile Pill */}
                <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                  <Link to="/dashboard" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-xs uppercase group-hover:ring-2 group-hover:ring-brand-500 transition-all">
                      {user.name ? user.name[0] : 'U'}
                    </div>
                  </Link>
                  <button
                    onClick={onLogout}
                    className="text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Join Platform
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-brand-100 dark:border-gray-800 bg-white/95 dark:bg-charcoal/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-brand-50 dark:hover:bg-gray-800"
            >
              {link.label}
            </Link>
          ))}

          {roleDashboardLink && (
            <Link
              to={roleDashboardLink.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-gray-800"
            >
              {roleDashboardLink.label}
            </Link>
          )}

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-brand-50 dark:hover:bg-gray-800"
                >
                  <span className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-accent-500 text-white text-xs font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <div className="px-3 py-1 text-xs text-gray-500">
                  Signed in as <strong>{user.name}</strong> ({user.role})
                </div>
                <Button variant="danger" size="sm" onClick={() => { setMobileMenuOpen(false); onLogout?.() }}>
                  Log Out
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Log In</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">Join</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
