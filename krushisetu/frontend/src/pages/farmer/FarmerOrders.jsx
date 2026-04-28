import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { StatusBadge } from '../../components/common/StatusBadge'
import { SkeletonRow } from '../../components/common/Skeleton'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { orderAPI } from '../../api/services'
import { formatINR, formatDate, timeAgo } from '../../utils/helpers'
import toast from 'react-hot-toast'

const STATUSES = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export default function FarmerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [confirm, setConfirm] = useState(null)

  const load = async () => {
    setLoading(true)
    try { const { data } = await orderAPI.getMyOrders(); setOrders(data) }
    catch { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id, status, label) => {
    try {
      await orderAPI.updateStatus(id, status)
      toast.success(`Order ${label}`)
      load()
    } catch { toast.error('Update failed') }
  }

  const promptStatus = (id, status, label, message) => {
    setConfirm({
      title: `${label} this order?`,
      message,
      confirmLabel: label,
      danger: status === 'cancelled',
      onConfirm: () => updateStatus(id, status, label),
    })
  }

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = s === 'all' ? orders.length : orders.filter(o => o.status === s).length
    return acc
  }, {})

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {counts.pending > 0
            ? <span className="text-earth-600 font-medium">{counts.pending} order{counts.pending > 1 ? 's' : ''} waiting for your response</span>
            : 'All orders are up to date'}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all flex items-center gap-1.5 ${
              filter === s ? 'bg-primary-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>
            {s}
            {counts[s] > 0 && (
              <span className={`text-xs rounded-full px-1.5 py-0.5 ${filter === s ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {counts[s]}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState emoji="📦" title="No orders found" description={`No ${filter === 'all' ? '' : filter + ' '}orders at the moment.`} />
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <div key={order._id} className="card hover:shadow-card-hover transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Crop thumb */}
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-earth-100 rounded-xl overflow-hidden flex-shrink-0">
                  {order.cropId?.imageUrl
                    ? <img src={order.cropId.imageUrl} className="w-full h-full object-cover" alt={order.cropId.cropName} />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🌾</div>
                  }
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.cropId?.cropName}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Trader: <span className="font-medium">{order.traderId?.fullName}</span>
                        {order.traderId?.phone && <> · {order.traderId.phone}</>}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-primary-700 font-bold text-sm">{formatINR(order.totalPrice)}</span>
                        <span className="text-gray-400 text-xs">({order.quantity} kg)</span>
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  {order.deliveryAddress && (
                    <p className="text-xs text-gray-400 mt-1.5">📍 {order.deliveryAddress}</p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 flex-shrink-0 flex-wrap">
                  {order.status === 'pending' && <>
                    <button
                      onClick={() => promptStatus(order._id, 'confirmed', 'Accept', 'This will confirm the order and notify the trader.')}
                      className="btn-primary text-xs py-2 px-3">
                      Accept
                    </button>
                    <button
                      onClick={() => promptStatus(order._id, 'cancelled', 'Reject', 'This will cancel the order and make the crop available again.', true)}
                      className="btn-secondary text-xs py-2 px-3 text-red-500 border-red-200 hover:bg-red-50">
                      Reject
                    </button>
                  </>}
                  {order.status === 'confirmed' && (
                    <button onClick={() => promptStatus(order._id, 'shipped', 'Shipped', 'Mark this order as shipped / dispatched?')}
                      className="btn-primary text-xs py-2 px-3">
                      Mark Shipped
                    </button>
                  )}
                  {order.status === 'shipped' && (
                    <button onClick={() => promptStatus(order._id, 'delivered', 'Delivered', 'Confirm delivery of this order?')}
                      className="btn-primary text-xs py-2 px-3">
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">{timeAgo(order.createdAt)}</p>
                <p className="text-xs text-gray-300 font-mono">{order._id.slice(-8).toUpperCase()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog state={confirm} onClose={() => setConfirm(null)} />
    </DashboardLayout>
  )
}
