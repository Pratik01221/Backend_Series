import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { StatusBadge } from '../../components/common/StatusBadge'
import { SkeletonRow } from '../../components/common/Skeleton'
import EmptyState from '../../components/common/EmptyState'
import { bidAPI } from '../../api/services'
import { formatINR, timeAgo } from '../../utils/helpers'
import toast from 'react-hot-toast'

const FILTERS = ['all', 'pending', 'accepted', 'rejected', 'converted']

export default function TraderBids() {
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    bidAPI.getMyBids()
      .then(r => setBids(r.data))
      .catch(() => toast.error('Failed to load bids'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? bids : bids.filter(b => b.status === filter)

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'all' ? bids.length : bids.filter(b => b.status === f).length
    return acc
  }, {})

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">My Bids</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {counts.pending > 0
            ? <span className="text-yellow-600 font-medium">{counts.pending} bid{counts.pending > 1 ? 's' : ''} awaiting farmer response</span>
            : 'Track all your submitted bids'}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all flex items-center gap-1.5 ${
              filter === f ? 'bg-primary-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>
            {f}
            {counts[f] > 0 && (
              <span className={`text-xs rounded-full px-1.5 py-0.5 ${filter === f ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {counts[f]}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading
        ? <div className="space-y-4">{[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}</div>
        : filtered.length === 0
          ? <EmptyState
              emoji="🔨"
              title="No bids found"
              description="Browse bidding-type crops in the marketplace to place bids."
              actionLabel="Browse Marketplace"
              actionTo="/marketplace"
            />
          : (
            <div className="space-y-4">
              {filtered.map(bid => (
                <div key={bid._id} className="card hover:shadow-card-hover transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Crop image */}
                    <div className="w-14 h-14 bg-gradient-to-br from-earth-100 to-primary-100 rounded-xl overflow-hidden flex-shrink-0">
                      {bid.cropId?.imageUrl
                        ? <img src={bid.cropId.imageUrl} className="w-full h-full object-cover" alt={bid.cropId.cropName} />
                        : <div className="w-full h-full flex items-center justify-center text-2xl">🌾</div>
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{bid.cropId?.cropName}</h3>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="text-earth-600 font-bold">{formatINR(bid.bidAmount)}/kg</span>
                            <span className="text-gray-400 text-sm">{bid.quantity} kg</span>
                            <span className="text-gray-500 text-sm font-medium">
                              = {formatINR(bid.bidAmount * bid.quantity)}
                            </span>
                          </div>
                          {bid.message && (
                            <p className="text-xs text-gray-400 mt-1 italic">
                              Your note: "{bid.message}"
                            </p>
                          )}
                        </div>
                        <StatusBadge status={bid.status} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400">{timeAgo(bid.createdAt)}</p>
                    <p className="text-xs text-gray-300 font-mono">{bid._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          )
      }
    </DashboardLayout>
  )
}
