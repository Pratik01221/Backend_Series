import { useState } from 'react'
import { X, Star } from 'lucide-react'
import { reviewAPI } from '../../api/services'
import toast from 'react-hot-toast'

export default function ReviewModal({ order, onClose, onSuccess }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (!rating) return toast.error('Please select a rating')
    setSubmitting(true)
    try {
      await reviewAPI.create({ orderId: order._id, rating, comment })
      toast.success('Review submitted!')
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h3 className="font-display text-xl font-bold text-gray-900">Leave a Review</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
            Order: <span className="font-medium">{order.cropId?.cropName}</span> · {order.quantity} kg
          </div>

          {/* Star rating */}
          <div className="text-center">
            <p className="label mb-3 text-center">Your Rating</p>
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-125">
                  <Star size={32} className={`transition-colors ${(hover || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
            <p className={`text-sm font-medium h-5 ${rating ? 'text-primary-600' : 'text-gray-400'}`}>
              {labels[hover || rating]}
            </p>
          </div>

          <div>
            <label className="label">Comment <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea className="input resize-none" rows={3}
              placeholder="Share your experience with this farmer..."
              value={comment} onChange={e => setComment(e.target.value)} />
          </div>

          <button onClick={submit} disabled={submitting || !rating} className="btn-primary w-full py-3">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  )
}
