import React, { useState } from 'react'
import { Star, Send, Heart } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'
import { requestService } from '../../api/requestService'
import { useToast } from '../../context/ToastContext'

export default function FeedbackModal({ isOpen, onClose, request, onSuccess }) {
  const { addToast } = useToast()
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!request) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await requestService.submitFeedback(request.id, {
        rating,
        feedback: feedback.trim(),
      })

      addToast({
        type: 'success',
        title: 'Thank You For Your Feedback!',
        message: 'Your rating helps build community trust and safety across the network.',
      })

      onSuccess?.()
      onClose()
    } catch {
      addToast({ type: 'error', title: 'Submission Failed', message: 'Could not save feedback.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rate Food Collection"
      description="Help our community by sharing your experience with this donation pickup."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Item preview */}
        <div className="p-3 bg-cream-50 dark:bg-charcoal-dark rounded-xl border border-brand-100 dark:border-gray-800 text-xs">
          <strong>Item:</strong> {request.food?.title || 'Surplus Food'} • <strong>Donor:</strong> {request.food?.donorName || 'Donor'}
        </div>

        {/* Interactive Star Rating */}
        <div className="text-center space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
            Overall Rating
          </label>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`Rate ${star} star`}
                >
                  <Star
                    className={`w-7 h-7 ${
                      active ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              )
            })}
          </div>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
            {rating === 5 ? 'Excellent & Fresh' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : 'Could Be Improved'}
          </span>
        </div>

        {/* Comments */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Comments &amp; Packaging Feedback (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Food was clean, hot, and carefully packed. Volunteers arrived easily."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-charcoal text-sm p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Skip
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            Submit Review
          </Button>
        </div>

      </form>
    </Modal>
  )
}
