import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Inbox,
  BarChart3,
  ShieldAlert,
  Users,
  Settings,
  LogOut
} from 'lucide-react'
import Badge from '../ui/Badge'

export default function Sidebar({ user, onLogout, className = '' }) {
  if (!user) return null

  const role = user.role || 'receiver'

  const donorLinks = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Add Food Listing', path: '/donor/add', icon: PlusCircle },
    { label: 'My Donations', path: '/donor/donations', icon: Package },
    { label: 'Incoming Requests', path: '/donor/requests', icon: Inbox },
    { label: 'Impact Analytics', path: '/statistics', icon: BarChart3 },
  ]

  const receiverLinks = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Browse Food', path: '/browse', icon: Package },
    { label: 'My Requests', path: '/receiver/requests', icon: Inbox },
    { label: 'Impact Stats', path: '/statistics', icon: BarChart3 },
  ]

  const adminLinks = [
    { label: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Listings Moderation', path: '/admin/listings', icon: Package },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
    { label: 'Reports Queue', path: '/admin/reports', icon: ShieldAlert },
    { label: 'Platform Stats', path: '/statistics', icon: BarChart3 },
  ]

  const links =
    role === 'donor' || role === 'restaurant'
      ? donorLinks
      : role === 'admin'
      ? adminLinks
      : receiverLinks

  return (
    <aside className={`w-64 bg-white dark:bg-charcoal border-r border-brand-100 dark:border-gray-800 flex flex-col justify-between p-4 transition-colors ${className}`}>
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3.5 bg-cream-100 dark:bg-gray-800/60 rounded-2xl border border-brand-100 dark:border-gray-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold text-sm flex items-center justify-center uppercase shadow-sm">
              {user.name ? user.name[0] : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold truncate text-charcoal dark:text-cream-50">
                {user.name || 'User'}
              </h4>
              <Badge status={role === 'restaurant' ? 'Available' : 'Accepted'} size="sm" className="mt-1">
                {role.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
            Navigation Menu
          </p>
          {links.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-cream-100 dark:hover:bg-gray-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Footer action: Logout */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
