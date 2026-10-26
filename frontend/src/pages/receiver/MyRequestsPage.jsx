import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Inbox,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  Star,
  Package,
  Phone,
  Sparkles
} from 'lucide-react'
import { requestService } from '../../api/requestService'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../context/ToastContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import ReceiptModal from '../../components/ui/ReceiptModal'
import FeedbackModal from '../../components/ui/FeedbackModal'
import { CardSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'

export default function MyRequestsPage() {
  const { user } = useAuth()
  const { addToast } = useToast()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')

  // Modals state
  const [receiptItem, setReceiptItem] = useState(null)
  const [feedbackRequest, setFeedbackRequest] = useState(null)

  const tabs = ['All', 'Requested', 'Accepted', 'Collected', 'Rejected']

  const loadRequests = async () => {
    setLoading(true)
    try {
      const data = await requestService.getMyRequests()
      setRequests(data || [])
    } catch {
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  // Action: Receiver confirms food collection
  const handleConfirmCollection = async (req) => {
    try {
      await requestService.confirmCollection(req.id)
      setRequests((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, status: 'Collected' } : r))
      )
      addToast({
        type: 'success',
        title: 'Collection Completed!',
        message: 'Food marked as Collected. Thank you for rescuing surplus meals!',
      })
      // Open feedback modal immediately to rate the donor
      setFeedbackRequest(req)
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: err.message })
    }
  }

  const filteredRequests = requests.filter((r) => {
    if (activeTab === 'All') return true
    return r.status?.toLowerCase() === activeTab.toLowerCase()
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-100 dark:border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            <Sparkles className="w-4 h-4 text-accent-500" />
            <span>Community Receiver Portal</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-charcoal dark:text-cream-50 mt-1">
            My Collection Requests
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your reserved surplus food pickups, confirm arrivals, and rate partner donors.
          </p>
        </div>

        <Link to="/browse">
          <Button variant="primary" size="md" leftIcon={<Package className="w-4 h-4" />}>
            Browse More Food
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 text-xs no-scrollbar">
        {tabs.map((tab) => {
          const count = requests.filter((r) => tab === 'All' || r.status?.toLowerCase() === tab.toLowerCase()).length
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white dark:bg-charcoal text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <span>{tab}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === tab ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Request Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          title={`No collection requests in "${activeTab}"`}
          description="Browse available food to reserve wholesome surplus meals for your community."
          actionLabel="Browse Surplus Food"
          onAction={() => window.location.href = '/browse'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((req) => (
            <Card key={req.id} className="p-0 overflow-hidden flex flex-col justify-between">
              
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge status={req.status} size="sm" />
                      <span className="text-xs text-gray-500">Req ID: {req.id}</span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-charcoal dark:text-cream-50">
                      {req.food?.title || 'Surplus Food Donation'}
                    </h3>
                    <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold mt-0.5">
                      Quantity: {req.food?.quantity} {req.food?.unit}
                    </p>
                  </div>
                </div>

                {req.notes && (
                  <div className="p-3 bg-cream-50 dark:bg-charcoal-dark rounded-xl border border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300">
                    <strong>Pickup Notes:</strong> {req.notes}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-500 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    <span className="truncate">{req.food?.pickupLocation || 'Local Donor Address'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Clock className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    <span className="truncate">Pickup: {new Date(req.estimatedPickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-end gap-2 text-xs">
                
                {req.status === 'Requested' && (
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium animate-pulse">
                    Waiting for donor to accept pickup window...
                  </span>
                )}

                {req.status === 'Accepted' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleConfirmCollection(req)}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Confirm Collection (Collected)
                  </Button>
                )}

                {req.status === 'Collected' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReceiptItem(req)}
                      leftIcon={<FileText className="w-3.5 h-3.5" />}
                    >
                      View Receipt
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setFeedbackRequest(req)}
                      leftIcon={<Star className="w-3.5 h-3.5" />}
                    >
                      {req.rating ? 'Update Review' : 'Rate Experience'}
                    </Button>
                  </>
                )}

                {req.status === 'Rejected' && (
                  <span className="text-[11px] text-rose-500 italic">
                    Request declined by donor
                  </span>
                )}

              </div>

            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <ReceiptModal
        isOpen={Boolean(receiptItem)}
        onClose={() => setReceiptItem(null)}
        donation={receiptItem}
      />

      <FeedbackModal
        isOpen={Boolean(feedbackRequest)}
        onClose={() => setFeedbackRequest(null)}
        request={feedbackRequest}
        onSuccess={loadRequests}
      />

    </div>
  )
}
