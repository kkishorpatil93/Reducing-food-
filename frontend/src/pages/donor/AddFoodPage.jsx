import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PlusCircle,
  UploadCloud,
  X,
  Clock,
  MapPin,
  Tag,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  Info,
  Calendar,
  Utensils
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../context/ToastContext'
import { foodService } from '../../api/foodService'
import { validateAndCompressImage } from '../../utils/imageCompress'
import { isFutureDate, isAfter } from '../../utils/validators'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'

// Format ISO string to datetime-local value (YYYY-MM-DDTHH:mm)
const toDatetimeLocal = (date) => {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export default function AddFoodPage() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  // Default times: available from now, expiring in 3 hours
  const defaultAvailable = toDatetimeLocal(Date.now())
  const defaultExpiry = toDatetimeLocal(Date.now() + 3 * 3600 * 1000)

  const [formData, setFormData] = useState({
    title: '',
    category: 'Prepared Meals',
    quantity: '',
    unit: 'portions',
    pickupLocation: user?.address || '42 Baker Street, Downtown',
    availableFrom: defaultAvailable,
    expiryTime: defaultExpiry,
    description: '',
    dietaryTags: ['Vegetarian'],
    allergens: [],
  })

  // Image upload state
  const [imagePreview, setImagePreview] = useState(null)
  const [compressedImage, setCompressedImage] = useState(null)
  const [imageMeta, setImageMeta] = useState(null)
  const [imageError, setImageError] = useState(null)
  const [isCompressing, setIsCompressing] = useState(false)

  // Validation & submission state
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const categories = [
    'Bakery',
    'Prepared Meals',
    'Produce',
    'Dairy',
    'Pantry Staples',
    'Beverages',
    'Other'
  ]

  const unitOptions = [
    'portions',
    'boxed meals',
    'loaves',
    'kg',
    'liters',
    'crates',
    'platters',
    'packs'
  ]

  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Non-Vegetarian',
    'Halal',
    'Kosher',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free'
  ]

  const allergenOptions = [
    'Gluten',
    'Dairy',
    'Eggs',
    'Nuts',
    'Soy',
    'Fish',
    'Shellfish',
    'Sesame'
  ]

  // Toggle multi-select tags
  const toggleDietaryTag = (tag) => {
    setFormData((prev) => {
      const exists = prev.dietaryTags.includes(tag)
      return {
        ...prev,
        dietaryTags: exists
          ? prev.dietaryTags.filter((t) => t !== tag)
          : [...prev.dietaryTags, tag]
      }
    })
  }

  const toggleAllergen = (allergen) => {
    setFormData((prev) => {
      const exists = prev.allergens.includes(allergen)
      return {
        ...prev,
        allergens: exists
          ? prev.allergens.filter((a) => a !== allergen)
          : [...prev.allergens, allergen]
      }
    })
  }

  // Handle client-side image selection & compression
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageError(null)
    setIsCompressing(true)

    try {
      const result = await validateAndCompressImage(file)
      setImagePreview(result.dataUrl)
      setCompressedImage(result.dataUrl)
      setImageMeta({
        origKb: Math.round(result.originalSize / 1024),
        compKb: Math.round(result.dataUrl.length * 0.75 / 1024),
      })
      if (errors.image) setErrors({ ...errors, image: null })
    } catch (err) {
      setImageError(err.message || 'Image processing failed.')
      setImagePreview(null)
      setCompressedImage(null)
    } finally {
      setIsCompressing(false)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setCompressedImage(null)
    setImageMeta(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Validate entire form
  const validate = () => {
    const errs = {}

    if (!formData.title.trim()) {
      errs.title = 'Food listing title is required.'
    } else if (formData.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters.'
    } else if (formData.title.trim().length > 100) {
      errs.title = 'Title must be 100 characters or fewer.'
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      errs.quantity = 'Please enter a valid quantity greater than zero.'
    }

    if (!formData.pickupLocation.trim()) {
      errs.pickupLocation = 'Pickup location address is required.'
    }

    if (!formData.availableFrom) {
      errs.availableFrom = 'Available-from time is required.'
    }

    if (!formData.expiryTime) {
      errs.expiryTime = 'Expiry time is required.'
    } else if (!isFutureDate(formData.expiryTime)) {
      errs.expiryTime = 'Expiry time must be in the future.'
    } else if (!isAfter(formData.expiryTime, formData.availableFrom)) {
      errs.expiryTime = 'Expiry time must be after the available-from pickup time.'
    }

    if (!formData.description.trim()) {
      errs.description = 'Please provide a brief description (storage conditions, packaging).'
    }

    if (!compressedImage && !imagePreview) {
      errs.image = 'Please upload a photo of the food donation.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        pickupLocation: formData.pickupLocation.trim(),
        availableFrom: new Date(formData.availableFrom).toISOString(),
        expiryTime: new Date(formData.expiryTime).toISOString(),
        description: formData.description.trim(),
        dietaryTags: formData.dietaryTags,
        allergens: formData.allergens,
        imageUrl: compressedImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
      }

      await foodService.createFood(payload)

      addToast({
        type: 'success',
        title: 'Donation Listed Successfully!',
        message: 'Nearby shelters and receivers have been notified of your surplus food.',
        duration: 5000,
      })

      navigate('/browse')
    } catch (err) {
      setErrors({ form: err.message || 'Failed to publish food listing. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          <Utensils className="w-4 h-4" />
          <span>Donor Food Rescue Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-charcoal dark:text-cream-50">
          List Surplus Food Donation
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Share wholesome unsold food before it expires. Local community shelters will coordinate collection.
        </p>
      </div>

      {errors.form && (
        <div role="alert" className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 rounded-2xl text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        
        {/* Section 1: Basic Information */}
        <Card className="p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-heading font-bold text-charcoal dark:text-cream-50 border-b border-gray-100 dark:border-gray-800 pb-3">
            1. Food Details & Quantity
          </h2>

          <Input
            id="food-title"
            label="Food Title / Description"
            placeholder="e.g. 15 Loaves of Fresh Artisan Bread, Vegetable Curry"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value })
              if (errors.title) setErrors({ ...errors, title: null })
            }}
            error={errors.title}
            helperText="Clear, descriptive names help receivers assess who they can serve."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="food-category" className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Category <span className="text-accent-500">*</span>
              </label>
              <select
                id="food-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-charcoal text-charcoal dark:text-cream-50 text-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <Input
              id="food-quantity"
              label="Quantity"
              type="number"
              min="1"
              placeholder="e.g. 15"
              value={formData.quantity}
              onChange={(e) => {
                setFormData({ ...formData, quantity: e.target.value })
                if (errors.quantity) setErrors({ ...errors, quantity: null })
              }}
              error={errors.quantity}
              required
            />

            {/* Unit */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="food-unit" className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Unit Measure
              </label>
              <select
                id="food-unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-charcoal text-charcoal dark:text-cream-50 text-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {unitOptions.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Description */}
          <Input
            id="food-description"
            label="Storage & Condition Notes"
            rows={3}
            placeholder="e.g. Prepared hot today. Kept in sealed thermal containers. Ready for immediate distribution."
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value })
              if (errors.description) setErrors({ ...errors, description: null })
            }}
            error={errors.description}
            helperText="Include temperature history, container requirements, or preparation notes."
            required
          />
        </Card>

        {/* Section 2: Timing & Pickup Window */}
        <Card className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <h2 className="text-base font-heading font-bold text-charcoal dark:text-cream-50">
              2. Pickup Window & Expiry Time
            </h2>
            <span className="text-xs text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Real-Time Expiration Guard</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <Input
              id="food-available-from"
              label="Available For Pickup From"
              type="datetime-local"
              value={formData.availableFrom}
              onChange={(e) => {
                setFormData({ ...formData, availableFrom: e.target.value })
                if (errors.availableFrom) setErrors({ ...errors, availableFrom: null })
              }}
              error={errors.availableFrom}
              required
            />

            <Input
              id="food-expiry-time"
              label="Strict Expiration Time"
              type="datetime-local"
              value={formData.expiryTime}
              onChange={(e) => {
                setFormData({ ...formData, expiryTime: e.target.value })
                if (errors.expiryTime) setErrors({ ...errors, expiryTime: null })
              }}
              error={errors.expiryTime}
              helperText="Items expiring in under 2 hours are automatically marked with an Urgency Badge."
              required
            />

          </div>

          {/* Pickup Location */}
          <Input
            id="food-location"
            label="Pickup Address & Entry Instructions"
            placeholder="e.g. 42 Baker Street (Kitchen door in alleyway)"
            value={formData.pickupLocation}
            onChange={(e) => {
              setFormData({ ...formData, pickupLocation: e.target.value })
              if (errors.pickupLocation) setErrors({ ...errors, pickupLocation: null })
            }}
            leftIcon={<MapPin className="w-4 h-4" />}
            error={errors.pickupLocation}
            required
          />
        </Card>

        {/* Section 3: Dietary Tags & Allergen Checklist */}
        <Card className="p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-heading font-bold text-charcoal dark:text-cream-50 border-b border-gray-100 dark:border-gray-800 pb-3">
            3. Dietary Specifications & Allergens
          </h2>

          {/* Dietary Tags */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
              Dietary Tags (Select all that apply)
            </span>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((tag) => {
                const isSelected = formData.dietaryTags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleDietaryTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{tag}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Allergens Checklist */}
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
              Contains Major Allergens:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {allergenOptions.map((allergen) => {
                const checked = formData.allergens.includes(allergen)
                return (
                  <label
                    key={allergen}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      checked
                        ? 'border-amber-400 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                        : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-charcoal text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAllergen(allergen)}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span className="font-medium">{allergen}</span>
                  </label>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Section 4: Photo Upload with Compression */}
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <h2 className="text-base font-heading font-bold text-charcoal dark:text-cream-50">
              4. Food Photo (JPG, PNG, WebP • Max 5 MB)
            </h2>
            {imageMeta && (
              <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                Compressed: {imageMeta.origKb} KB → {imageMeta.compKb} KB (Canvas Opt)
              </span>
            )}
          </div>

          {imageError && (
            <div role="alert" className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 rounded-xl text-xs text-red-600 dark:text-red-400">
              {imageError}
            </div>
          )}

          {errors.image && (
            <p className="text-xs text-red-500 font-medium">{errors.image}</p>
          )}

          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 max-h-72 w-full bg-black/5">
              <img
                src={imagePreview}
                alt="Donation preview"
                className="w-full h-72 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                aria-label="Remove image"
                className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-8 sm:p-12 text-center hover:border-brand-500 hover:bg-brand-50/20 dark:hover:bg-brand-950/20 transition-all cursor-pointer space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
                id="food-photo-input"
              />
              <div className="w-14 h-14 rounded-2xl bg-cream-200 dark:bg-gray-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-xs">
                {isCompressing ? (
                  <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UploadCloud className="w-7 h-7" />
                )}
              </div>
              <div>
                <span className="text-sm font-semibold text-charcoal dark:text-cream-50">
                  {isCompressing ? 'Compressing high-res photo...' : 'Click or drag photo here to upload'}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  JPG, PNG, or WebP up to 5 MB. Photos are automatically compressed on-device for fast loading.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => setShowCancelModal(true)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            leftIcon={<PlusCircle className="w-5 h-5" />}
            className="w-full sm:w-auto shadow-md"
          >
            Publish Food Donation
          </Button>
        </div>

      </form>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Discard Donation Listing?"
        description="Are you sure you want to cancel? Any details entered will not be saved."
      >
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" size="sm" onClick={() => setShowCancelModal(false)}>
            Continue Editing
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setShowCancelModal(false)
              navigate('/')
            }}
          >
            Discard
          </Button>
        </div>
      </Modal>

    </div>
  )
}
