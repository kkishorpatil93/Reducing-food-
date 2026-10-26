import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  Clock,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Heart,
  Share2,
  CheckCircle2,
  Phone,
  Sparkles,
  Utensils
} from 'lucide-react'
import { foodService } from '../../api/foodService'
import { requestService } from '../../api/requestService'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../context/ToastContext'
import { useFavorites } from '../../hooks/useFavorites'
import { isFutureDate, isAfter } from '../../utils/validators'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import UrgencyBadge from '../../components/ui/UrgencyBadge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Skeleton from '../../components/ui/Skeleton'
import ErrorMessage from '../../components/ui/ErrorMessage'

// Format ISO string to datetime-local value
const toDatetimeLocal = (date) => {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export default function FoodDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { addToast } = useToast()
  const { isFavorite, toggleFavorite } = useFavorites()

  const [food, setFood] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Request modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [requestNotes, setRequestNotes] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [agreeSafety, setAgreeSafety] = useState(false)
  const [modalError, setModalError] = useState('')
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false)

  const fetchFoodDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await foodService.getFoodById(id)
      setFood(data)
      // Set default pickup time to 1 hour from now or halfway to expiry
      const halfTime = new Date(Date.now() + 3600 * 1000)
      setPickupTime(toDatetimeLocal(halfTime))
    } catch (err) {
      setError(err.message || 'Listing not found.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFoodDetails()
  }, [id])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: food?.title || 'FoodSave AI Donation',
        text: `Rescue ${food?.quantity} ${food?.unit} of ${food?.title} before it expires!`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      addToast({ type: 'info', title: 'Link Copied', message: 'Share link copied to clipboard.' })
    }
  }

  const handleOpenRequestModal = () => {
    if (!isAuthenticated) {
      addToast({ type: 'warning', title: 'Sign In Required', message: 'Please sign in to request surplus food collection.' })
      navigate('/login', { state: { from: { pathname: `/foods/${id}` } } })
      return
    }
    setModalError('')
    setIsModalOpen(true)
  }

  const handleConfirmRequest = async (e) => {
    e.preventDefault()
    setModalError('')

    if (!pickupTime) {
      setModalError('Please specify an estimated pickup time.')
      return
    }
    if (!isFutureDate(pickupTime)) {
      setModalError('Pickup time must be in the future.')
      return
    }
    if (food?.expiryTime && isAfter(pickupTime, food.expiryTime)) {
      setModalError('Estimated pickup must be before the food expiration time.')
      return
    }
    if (!agreeSafety) {
      setModalError('You must agree to food safety and collection commitment.')
      return
    }

    setIsSubmittingRequest(true)
    try {
      await requestService.createRequest({
        foodId: food.id,
        notes: requestNotes.trim(),
        estimatedPickupTime: new Date(pickupTime).toISOString(),
      })

      // Update food status locally to Requested
      setFood((prev) => ({ ...prev, status: 'Requested' }))
      setIsModalOpen(false)

      addToast({
        type: 'success',
        title: 'Collection Request Sent!',
        message: 'The donor has been notified. Check My Requests for status updates.',
        duration: 5000,
      })
    } catch (err) {
      setModalError(err.message || 'Failed to submit request. Please try again.')
    } finally {
      setIsSubmittingRequest(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton variant="text" width="120px" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton variant="rect" className="h-96" />
          <div className="space-y-4">
            <Skeleton variant="title" />
            <Skeleton variant="badge" />
            <Skeleton variant="text" count={4} />
          </div>
        </div>
      </div>
    )
  }

  if (error || !food) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <ErrorMessage
          title="Listing Not Found"
          message={error || 'The requested food donation listing is unavailable or has expired.'}
          onRetry={fetchFoodDetails}
        />
        <div className="mt-6 text-center">
          <Link to="/browse">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Browse Food
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isAvailable = food.status === 'Available'
  const isOwner = user?.id === food.donor?.id
  const fav = isFavorite(food.id)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button & Action controls */}
      <div className="flex items-center justify-between">
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse Listings</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFavorite(food.id)}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-charcoal text-gray-500 hover:text-rose-500 transition-colors shadow-xs"
            aria-label={fav ? 'Remove from saved' : 'Save listing'}
          >
            <Heart className={`w-4 h-4 ${fav ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-charcoal text-gray-500 hover:text-charcoal dark:hover:text-cream-50 transition-colors shadow-xs"
            aria-label="Share listing"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Photo Hero + Food Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Photo Container */}
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden shadow-soft border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 aspect-4/3">
            <img
              src={food.imageUrl}
              alt={food.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge status={food.status} size="lg" />
            </div>
            <div className="absolute top-4 right-4 bg-white/95 dark:bg-charcoal/95 backdrop-blur-md rounded-full px-3 py-1 shadow-sm">
              <UrgencyBadge expiryTime={food.expiryTime} />
            </div>
          </div>

          {/* Quick Dietary Tags Pill Strip */}
          {food.dietaryTags && food.dietaryTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {food.dietaryTags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 rounded-xl text-xs font-semibold border border-brand-100 dark:border-brand-900/40"
                >
                  ✓ {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Details */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-1">
              {food.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-charcoal dark:text-cream-50">
              {food.title}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
              <span className="font-bold text-charcoal dark:text-cream-50 bg-cream-200 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                Quantity: {food.quantity} {food.unit}
              </span>
              <span>• Listed {new Date(food.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-white dark:bg-charcoal rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Description &amp; Storage Conditions
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {food.description}
            </p>
          </div>

          {/* Allergen Warning */}
          {food.allergens && food.allergens.length > 0 && (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Allergen Notice:</strong> Contains{' '}
                {food.allergens.join(', ')}. Please inform recipients accordingly.
              </div>
            </div>
          )}

          {/* Pickup Window & Timing */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-white dark:bg-charcoal rounded-2xl border border-gray-100 dark:border-gray-800">
              <span className="text-gray-400 block mb-1">Pickup Available From:</span>
              <span className="font-semibold text-charcoal dark:text-cream-50">
                {new Date(food.availableFrom).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            </div>

            <div className="p-3.5 bg-white dark:bg-charcoal rounded-2xl border border-gray-100 dark:border-gray-800">
              <span className="text-gray-400 block mb-1">Strict Expiration Time:</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {new Date(food.expiryTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            </div>
          </div>

          {/* Donor Information Card */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-sm uppercase">
                  {food.donor?.name ? food.donor.name[0] : 'D'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-charcoal dark:text-cream-50 flex items-center gap-1.5">
                    <span>{food.donor?.name || 'Verified Food Donor'}</span>
                    <ShieldCheck className="w-4 h-4 text-brand-600" title="Verified Good Samaritan Partner" />
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                    <span className="text-amber-500 font-semibold">★ {food.donor?.rating || '4.9'} Donor Rating</span>
                    <span>• {food.donor?.role || 'Restaurant'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <span>{food.pickupLocation}</span>
            </div>
          </Card>

          {/* Collection CTA Button */}
          <div>
            {isOwner ? (
              <div className="p-3 bg-cream-200 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 rounded-xl text-center">
                You created this donation listing. Manage requests in <strong>My Donations</strong>.
              </div>
            ) : isAvailable ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handleOpenRequestModal}
                className="w-full shadow-md text-base"
              >
                Request Food Collection
              </Button>
            ) : (
              <div className="space-y-2">
                <Button variant="ghost" size="lg" disabled className="w-full opacity-60">
                  Listing Status: {food.status}
                </Button>
                <p className="text-center text-xs text-gray-500">
                  This item is no longer available for new requests.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Confirmation Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Collection Request"
        description="Reserve this surplus food for pickup by your team or volunteers."
      >
        <form onSubmit={handleConfirmRequest} className="space-y-4">
          
          {modalError && (
            <div role="alert" className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium">
              {modalError}
            </div>
          )}

          {/* Summary Box */}
          <div className="p-3.5 bg-cream-100 dark:bg-gray-800 rounded-2xl border border-brand-100 dark:border-gray-700 text-xs space-y-1">
            <p><strong>Food Item:</strong> {food.title} ({food.quantity} {food.unit})</p>
            <p><strong>Pickup Location:</strong> {food.pickupLocation}</p>
            <p><strong>Expires At:</strong> {new Date(food.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>

          <Input
            label="Estimated Pickup Time"
            type="datetime-local"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            helperText="Must be before the stated expiry time."
            required
          />

          <Input
            label="Notes for Donor (Optional)"
            rows={2}
            placeholder="e.g. Volunteer van arriving with insulated coolers. Contact name: Alex."
            value={requestNotes}
            onChange={(e) => setRequestNotes(e.target.value)}
          />

          <label className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={agreeSafety}
              onChange={(e) => setAgreeSafety(e.target.checked)}
              className="mt-0.5 rounded text-brand-600"
            />
            <span>
              I confirm our team will pick up this food within the window and distribute it safely to community recipients.
            </span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmittingRequest}
            >
              Send Request
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  )
}
