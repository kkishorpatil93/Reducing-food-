import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  PlusCircle,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react'
import { foodService } from '../../api/foodService'
import { requestService } from '../../api/requestService'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../context/ToastContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import UrgencyBadge from '../../components/ui/UrgencyBadge'
import ReceiptModal from '../../components/ui/ReceiptModal'
import { CardSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'

export default function MyDonationsPage() {
  const { user } = useAuth()
  const { addToast } = useToast()

  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')

  // Receipt Modal state
  const [receiptItem, setReceiptItem] = useState(null)

  const tabs = [
    'All',
    'Available',
    'Requested',
    'Accepted',
    'Collected',
    'Expired',
    'Cancelled'
  ]

  const loadDonations = async () => {
    setLoading(true)
    try {
      const data = await foodService.getMyDonations()
      setDonations(data || [])
    } catch {
      setDonations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDonations()
  }, [])

  // Action: Accept Request
  const handleAcceptRequest = async (foodId) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === foodId ? { ...d, status: 'Accepted' } : d))
    )
    addToast({
      type: 'success',
      title: 'Collection Request Accepted!',
      message: 'Receiver notified. Please prepare food for scheduled pickup.',
    })
  }

  // Action: Reject Request
  const handleRejectRequest = async (foodId) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === foodId ? { ...d, status: 'Rejected' } : d))
    )
    addToast({
      type: 'info',
      title: 'Request Declined',
      message: 'Item has been marked as rejected.',
    })
  }

  // Action: Mark as Handed Over / Collected
  const handleMarkCollected = async (food) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === food.id ? { ...d, status: 'Collected' } : d))
    )
    addToast({
      type: 'success',
      title: 'Food Handover Confirmed!',
      message: 'Donation marked as Collected. Impact metrics updated.',
    })
    setReceiptItem(food)
  }

  // Action: Cancel Listing
  const handleCancelListing = async (foodId) => {
    try {
      await foodService.deleteFood(foodId)
      setDonations((prev) =>
        prev.map((d) => (d.id === foodId ? { ...d, status: 'Cancelled' } : d))
      )
      addToast({
        type: 'info',
        title: 'Listing Cancelled',
        message: 'The food donation was removed from public browse.',
      })
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: err.message })
    }
  }

  // Filter donations by active status tab
  const filteredDonations = donations.filter((d) => {
    if (activeTab === 'All') return true
    return d.status?.toLowerCase() === activeTab.toLowerCase()
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-100 dark:border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            <Sparkles className="w-4 h-4 text-accent-500" />
            <span>Donor Management Dashboard</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-charcoal dark:text-cream-50 mt-1">
            My Food Donations
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track surplus listings, approve incoming charity requests, and download official donation receipts.
          </p>
        </div>

        <Link to="/donor/add">
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            List New Food Donation
          </Button>
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 text-xs no-scrollbar">
        {tabs.map((tab) => {
          const count = donations.filter((d) => tab === 'All' || d.status?.toLowerCase() === tab.toLowerCase()).length
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

      {/* Listings List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredDonations.length === 0 ? (
        <EmptyState
          title={`No donations in "${activeTab}" status`}
          description="You currently have no food items matching this lifecycle state."
          actionLabel="Create New Donation"
          onAction={() => window.location.href = '/donor/add'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDonations.map((item) => (
            <Card key={item.id} className="p-0 overflow-hidden flex flex-col justify-between">
              
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge status={item.status} size="sm" />
                        <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-base text-charcoal dark:text-cream-50">
                        {item.title}
                      </h3>
                      <span className="text-xs text-gray-500 font-medium">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  </div>

                  <UrgencyBadge expiryTime={item.expiryTime} />
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 bg-cream-50 dark:bg-charcoal-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    <span className="truncate">{item.pickupLocation}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Clock className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    <span className="truncate">Exp: {new Date(item.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons Bar */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-end gap-2 text-xs">
                
                {item.status === 'Available' && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancelListing(item.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      Cancel Listing
                    </Button>
                    <Link to={`/foods/${item.id}`}>
                      <Button variant="outline" size="sm">
                        View Public Card
                      </Button>
                    </Link>
                  </>
                )}

                {item.status === 'Requested' && (
                  <>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRejectRequest(item.id)}
                      leftIcon={<XCircle className="w-3.5 h-3.5" />}
                    >
                      Decline Request
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAcceptRequest(item.id)}
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      Accept Collection
                    </Button>
                  </>
                )}

                {item.status === 'Accepted' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleMarkCollected(item)}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Confirm Handover (Collected)
                  </Button>
                )}

                {item.status === 'Collected' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReceiptItem(item)}
                    leftIcon={<FileText className="w-3.5 h-3.5" />}
                  >
                    Donation Receipt
                  </Button>
                )}

                {(item.status === 'Expired' || item.status === 'Cancelled' || item.status === 'Rejected') && (
                  <span className="text-[11px] text-gray-400 italic">
                    Closed on {new Date().toLocaleDateString()}
                  </span>
                )}

              </div>

            </Card>
          ))}
        </div>
      )}

      {/* Printable Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(receiptItem)}
        onClose={() => setReceiptItem(null)}
        donation={receiptItem}
      />

    </div>
  )
}
