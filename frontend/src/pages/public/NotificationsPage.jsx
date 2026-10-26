import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  CheckCheck,
  Clock,
  Inbox,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Trash2,
  ArrowRight,
  Check,
  X,
  Sparkles
} from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'
import { useToast } from '../../context/ToastContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'

// Relative time helper
function formatRelativeTime(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const diffMins = Math.floor(diffMs / (60 * 1000))
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffHours / 24)}d ago`
}

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications()
  const { addToast } = useToast()

  const [filterType, setFilterType] = useState('All')

  const filterTabs = [
    { id: 'All', label: 'All' },
    { id: 'Unread', label: `Unread (${unreadCount})` },
    { id: 'request', label: 'Requests' },
    { id: 'urgency', label: 'Urgent' },
    { id: 'status', label: 'Updates' },
    { id: 'system', label: 'System' },
  ]

  const handleMarkAll = async () => {
    await markAllAsRead()
    addToast({
      type: 'success',
      title: 'All Notifications Marked as Read',
      message: 'Your notification center is all caught up.',
    })
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'All') return true
    if (filterType === 'Unread') return !n.read
    return n.type === filterType
  })

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'request':
        return <Inbox className="w-5 h-5 text-brand-600 dark:text-brand-400" />
      case 'urgency':
        return <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
      case 'status':
        return <CheckCircle2 className="w-5 h-5 text-blue-500" />
      case 'impact':
        return <Sparkles className="w-5 h-5 text-purple-500" />
      case 'system':
      default:
        return <ShieldAlert className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-100 dark:border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            <Bell className="w-4 h-4" />
            <span>Activity Center</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-charcoal dark:text-cream-50 mt-1">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time surplus food claims, handover milestones, and urgency expiry reminders.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAll}
            leftIcon={<CheckCheck className="w-4 h-4 text-brand-600" />}
          >
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 text-xs no-scrollbar">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              filterType === tab.id
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white dark:bg-charcoal text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications here"
          description={
            filterType === 'Unread'
              ? 'You are all caught up! No unread notifications.'
              : 'You have no notifications matching this category.'
          }
          actionLabel="Return Home"
          onAction={() => window.location.href = '/'}
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <Card
              key={notif.id}
              className={`p-4 sm:p-5 transition-all flex items-start justify-between gap-4 ${
                !notif.read
                  ? 'bg-brand-50/50 dark:bg-brand-950/20 border-brand-200 dark:border-brand-900/60 ring-1 ring-brand-100 dark:ring-transparent'
                  : 'bg-white dark:bg-charcoal'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                
                {/* Type Icon */}
                <div className={`p-2.5 rounded-2xl shrink-0 ${
                  !notif.read
                    ? 'bg-white dark:bg-charcoal shadow-xs'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  {getNotificationIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-heading ${!notif.read ? 'font-bold text-charcoal dark:text-cream-50' : 'font-semibold text-gray-700 dark:text-gray-300'}`}>
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" title="Unread" />
                    )}
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-gray-400">
                    <span>{formatRelativeTime(notif.timestamp)}</span>
                    {notif.link && (
                      <Link
                        to={notif.link}
                        onClick={() => markAsRead(notif.id)}
                        className="font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>{notif.actionText || 'View Details'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>

              </div>

              {/* Actions: Mark read / dismiss */}
              <div className="flex items-center gap-1 shrink-0">
                {!notif.read && (
                  <button
                    type="button"
                    onClick={() => markAsRead(notif.id)}
                    title="Mark as read"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteNotification(notif.id)}
                  title="Dismiss notification"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            </Card>
          ))}
        </div>
      )}

    </div>
  )
}
