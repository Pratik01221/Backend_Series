import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, Weight, IndianRupee, Calendar, ArrowLeft, ShoppingCart, Gavel, MessageSquare, Star, X, Share2 } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import { StatusBadge } from '../../components/common/StatusBadge'
import { SkeletonCard } from '../../components/common/Skeleton'
import { cropAPI, orderAPI, bidAPI, reviewAPI } from '../../api/services'
import { formatINR, formatDate, timeAgo, categoryEmoji } from '../../utils/helpers'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function CropDetail() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const [crop, setCrop] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeModal, setActiveModal] = useState(null) // 'order' | 'bid' | null
  const [submitting, setSubmitting] = useState(false)

  // Order form
  const [qty, setQty] = useState(1)
  const [address, setAddress] = useState('')
  // Bid form
  const [bidAmount, setBidAmount] = useState('')
  const [bidQty, setBidQty] = useState(1)
  const [bidMsg, setBidMsg] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await cropAPI.getById(id)
        setCrop(data)
        setBidQty(1)
        setQty(1)
        const rev = await reviewAPI.getFarmerReviews(data.farmerId._id || data.farmerId)
        setReviews(rev.data)
      } catch {
        toast.error('Crop not found')
        navigate('/marketplace')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleOrder = async () => {
    if (!qty || qty < 1) return toast.error('Enter a valid quantity')
    setSubmitting(true)
    try {
      await orderAPI.create({ cropId: id, quantity: Number(qty), deliveryAddress: address })
      toast.success('Order placed successfully!')
      setActiveModal(null)
      navigate('/trader/orders')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleBid = async () => {
    if (!bidAmount || Number(bidAmount) <= 0) return toast.error('Enter a valid bid amount')
    setSubmitting(true)
    try {
      await bidAPI.place({ cropId: id, bidAmount: Number(bidAmount), quantity: Number(bidQty), message: bidMsg })
      toast.success('Bid placed successfully!')
      setActiveModal(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bid failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied!')
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-8 bg-gray-200 rounded-xl animate-pulse" />)}
          </div>
        </div>
      </div>
    )
  }

  if (!crop) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/marketplace" className="hover:text-primary-600 flex items-center gap-1 transition-colors">
            <ArrowLeft size={15} /> Marketplace
          </Link>
          <span>/</span>
          <span className="capitalize text-gray-400">{crop.category}</span>
          <span>/</span>
          <span className="text-gray-700 font-medium">{crop.cropName}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary-100 to-earth-100 rounded-2xl overflow-hidden shadow-card">
              {crop.imageUrl
                ? <img src={crop.imageUrl} alt={crop.cropName} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-[8rem]">
                    {categoryEmoji[crop.category] || '🌾'}
                  </div>
              }
            </div>
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="badge-blue capitalize">{crop.category}</span>
              {crop.sellingType === 'bidding' && (
                <span className="bg-earth-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  🔨 Bidding
                </span>
              )}
            </div>
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 w-9 h-9 bg-white rounded-xl shadow flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Share2 size={15} className="text-gray-500" />
            </button>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="font-display text-3xl font-bold text-gray-900 leading-tight">{crop.cropName}</h1>
                <StatusBadge status={crop.status} />
              </div>
              {avgRating && (
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">{avgRating} ({reviews.length} reviews)</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-end gap-2">
              <div className="flex items-center gap-1">
                <IndianRupee size={22} className="text-primary-600" />
                <span className="font-display text-4xl font-bold text-primary-700">{crop.pricePerKg}</span>
                <span className="text-gray-400 text-base">/kg</span>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoTile icon={<Weight size={15} />} label="Available" value={`${crop.quantity - (crop.soldQuantity || 0)} kg`} />
              <InfoTile icon={<MapPin size={15} />} label="Location" value={crop.location} />
              {crop.harvestDate && (
                <InfoTile icon={<Calendar size={15} />} label="Harvest Date" value={formatDate(crop.harvestDate)} />
              )}
              <InfoTile icon={<span className="text-sm">👤</span>} label="Farmer" value={crop.farmerId?.fullName} />
            </div>

            {/* Description */}
            {crop.description && (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <p className="text-sm text-gray-600 leading-relaxed">{crop.description}</p>
              </div>
            )}

            {/* Bidding info */}
            {crop.sellingType === 'bidding' && crop.minimumBidAmount && (
              <div className="bg-earth-50 border border-earth-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-earth-600 font-medium uppercase tracking-wide">Minimum Bid</p>
                  <p className="font-bold text-earth-700 text-lg">{formatINR(crop.minimumBidAmount)}/kg</p>
                </div>
                {crop.biddingEndDate && (
                  <div className="text-right">
                    <p className="text-xs text-earth-600 font-medium uppercase tracking-wide">Bidding Ends</p>
                    <p className="font-semibold text-earth-700 text-sm">{formatDate(crop.biddingEndDate)}</p>
                  </div>
                )}
              </div>
            )}

            {/* CTA Buttons */}
            {user?.role === 'trader' && crop.status === 'available' && (
              <div className="flex gap-3">
                {crop.sellingType === 'fixed' && (
                  <button onClick={() => setActiveModal('order')}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 text-base">
                    <ShoppingCart size={18} /> Buy Now
                  </button>
                )}
                {crop.sellingType === 'bidding' && (
                  <button onClick={() => setActiveModal('bid')}
                    className="btn-earth flex-1 flex items-center justify-center gap-2 py-3 text-base">
                    <Gavel size={18} /> Place Bid
                  </button>
                )}
                <Link to="/messages"
                  className="btn-secondary px-4 py-3 flex items-center justify-center" title="Message farmer">
                  <MessageSquare size={18} />
                </Link>
              </div>
            )}

            {user?.role === 'farmer' && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
                This is your listing. <Link to="/farmer/crops" className="font-medium underline">Manage it here.</Link>
              </div>
            )}

            {!user && (
              <Link to="/login" className="btn-primary w-full text-center py-3 text-base">
                Sign in to Buy or Bid
              </Link>
            )}

            {/* Listed time */}
            <p className="text-xs text-gray-400">Listed {timeAgo(crop.createdAt)}</p>
          </div>
        </div>

        {/* Reviews section */}
        {reviews.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-5">
              Farmer Reviews
              {avgRating && <span className="text-primary-600 ml-3 text-xl">★ {avgRating}</span>}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map(r => (
                <div key={r._id} className="card">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm text-gray-900">{r.traderId?.fullName || 'Trader'}</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} className={i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-gray-500 leading-relaxed">{r.comment}</p>}
                  <p className="text-xs text-gray-300 mt-2">{timeAgo(r.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Modal */}
      {activeModal === 'order' && (
        <Modal title="Place Order" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="label">Quantity (kg)</label>
              <input className="input" type="number" min="1" max={crop.quantity - (crop.soldQuantity || 0)}
                value={qty} onChange={e => setQty(e.target.value)} />
              <p className="text-xs text-gray-400 mt-1">Max available: {crop.quantity - (crop.soldQuantity || 0)} kg</p>
            </div>
            <div>
              <label className="label">Delivery Address</label>
              <textarea className="input resize-none" rows={2}
                placeholder="Full delivery address…"
                value={address} onChange={e => setAddress(e.target.value)} />
            </div>
            <div className="bg-primary-50 rounded-xl p-4 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price / kg</span>
                <span className="font-medium">{formatINR(crop.pricePerKg)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity</span>
                <span className="font-medium">{qty} kg</span>
              </div>
              <div className="flex justify-between font-bold text-primary-700 pt-2 border-t border-primary-100">
                <span>Total</span>
                <span>{formatINR(Number(qty) * crop.pricePerKg)}</span>
              </div>
            </div>
            <button onClick={handleOrder} disabled={submitting || !qty}
              className="btn-primary w-full py-3">
              {submitting ? 'Placing order…' : 'Confirm Order'}
            </button>
          </div>
        </Modal>
      )}

      {/* Bid Modal */}
      {activeModal === 'bid' && (
        <Modal title="Place a Bid" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="label">Your Bid Price (₹/kg)</label>
              <input className="input" type="number" min={crop.minimumBidAmount || 1}
                placeholder={`Min: ${formatINR(crop.minimumBidAmount || crop.pricePerKg)}`}
                value={bidAmount} onChange={e => setBidAmount(e.target.value)} />
            </div>
            <div>
              <label className="label">Quantity (kg)</label>
              <input className="input" type="number" min="1" max={crop.quantity - (crop.soldQuantity || 0)}
                value={bidQty} onChange={e => setBidQty(e.target.value)} />
            </div>
            <div>
              <label className="label">Message to Farmer <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea className="input resize-none" rows={2}
                placeholder="Any special requirements or notes…"
                value={bidMsg} onChange={e => setBidMsg(e.target.value)} />
            </div>
            {bidAmount && bidQty && (
              <div className="bg-earth-50 rounded-xl p-3 text-sm">
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>Total Bid Value</span>
                  <span className="font-bold text-earth-700">{formatINR(Number(bidAmount) * Number(bidQty))}</span>
                </div>
              </div>
            )}
            <button onClick={handleBid} disabled={submitting || !bidAmount}
              className="btn-earth w-full py-3">
              {submitting ? 'Submitting…' : 'Submit Bid'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function InfoTile({ icon, label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
      <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">{icon} {label}</div>
      <p className="font-semibold text-gray-800 text-sm truncate">{value || '—'}</p>
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
