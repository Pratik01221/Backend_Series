import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { StatusBadge } from '../../components/common/StatusBadge'
import { SkeletonRow } from '../../components/common/Skeleton'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { bidAPI } from '../../api/services'
import { formatINR, timeAgo } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function FarmerBids() {
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [confirm, setConfirm] = useState(null)

  const load = async () => {
    setLoading(true)
    try { const { data } = await bidAPI.getMyBids(); setBids(data) }
    catch { toast.error('Failed to load bids') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const promptRespond = (bid, status) => {
    setConfirm({
      title: status === 'accepted' ? 'Accept this bid?' : 'Reject this bid?',
      message: status === 'accepted'
        ? `Accepting will create an order for ${bid.quantity} kg at ${formatINR(bid.bidAmount)}/kg = ${formatINR(bid.bidAmount * bid.quantity)} total.`
        : `The bid from ${bid.traderId?.fullName} will be declined.`,
      confirmLabel: status === 'accepted' ? 'Accept & Create Order' : 'Reject Bid',
      danger: status === 'rejected',
      icon: status === 'accepted' ? '✅' : '❌',
      onConfirm: () => respond(bid._id, status),
    })
  }

  const respond = async (id, status) => {
    try {
      await bidAPI.respond(id, status)
      toast.success(`Bid ${status === 'accepted' ? 'accepted — order created!' : 'rejected'}`)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    }
  }

  const TABS = ['pending', 'accepted', 'rejected', 'converted', 'all']
  const counts = TABS.reduce((acc, t) => {
    acc[t] = t === 'all' ? bids.length : bids.filter(b => b.status === t).length
    return acc
  }, {})
  const filtered = filter === 'all' ? bids : bids.filter(b => b.status === filter)

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Bids Received</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {counts.pending > 0
            ? <span className="text-earth-600 font-medium">{counts.pending} bid{counts.pending > 1 ? 's' : ''} need your response</span>
            : 'All bids are up to date'}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {TABS.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all flex items-center gap-1.5 ${
              filter === t ? 'bg-primary-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>
            {t}
            {counts[t] > 0 && (
              <span className={`text-xs rounded-full px-1.5 py-0.5 ${filter === t ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {counts[t]}
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
              title={filter === 'pending' ? 'No pending bids' : 'No bids found'}
              description={filter === 'pending'
                ? 'Add crops with "Bidding" selling type to receive bids from traders.'
                : `No ${filter} bids at this time.`}
              actionLabel={filter === 'pending' ? 'Add Bidding Crop' : undefined}
              actionTo={filter === 'pending' ? '/farmer/crops' : undefined}
            />
          : (
            <div className="space-y-4">
              {filtered.map(bid => (
                <div key={bid._id} className="card hover:shadow-card-hover transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Crop image */}
                    <div className="w-14 h-14 bg-gradient-to-br from-earth-100 to-primary-100 rounded-xl overflow-hidden flex-shrink-0">
                      {bid.cropId?.imageUrl
                        ? <img src={bid.cropId.imageUrl} className="w-full h-full object-cover" alt={bid.cropId.cropName} />
                        : <div className="w-full h-full flex items-center justify-center text-2xl">🌾</div>
                      }
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{bid.cropId?.cropName}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            From: <span className="font-medium">{bid.traderId?.fullName}</span>
                          </p>
                        </div>
                        <StatusBadge status={bid.status} />
                      </div>

                      {/* Bid details grid */}
                      <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-3 mt-2">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Bid Price</p>
                          <p className="font-bold text-earth-600">{formatINR(bid.bidAmount)}/kg</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Quantity</p>
                          <p className="font-semibold text-gray-800">{bid.quantity} kg</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Total Value</p>
                          <p className="font-bold text-primary-700">{formatINR(bid.bidAmount * bid.quantity)}</p>
                        </div>
                      </div>

                      {bid.message && (
                        <p className="text-xs text-gray-400 mt-2 italic bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">
                          💬 "{bid.message}"
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    {bid.status === 'pending' && (
                      <div className="flex sm:flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => promptRespond(bid, 'accepted')}
                          className="btn-primary text-xs py-2 px-4">
                          Accept
                        </button>
                        <button
                          onClick={() => promptRespond(bid, 'rejected')}
                          className="btn-secondary text-xs py-2 px-4 text-red-500 border-red-200 hover:bg-red-50">
                          Reject
                        </button>
                      </div>
                    )}
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

      <ConfirmDialog state={confirm} onClose={() => setConfirm(null)} />
    </DashboardLayout>
  )
}
