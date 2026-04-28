import { useState, useEffect } from 'react'
import { CreditCard, Star } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { StatusBadge } from '../../components/common/StatusBadge'
import PaymentModal from '../../components/common/PaymentModal'
import ReviewModal from '../../components/common/ReviewModal'
import { orderAPI } from '../../api/services'
import toast from 'react-hot-toast'

export default function TraderOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [payOrder, setPayOrder] = useState(null)
  const [reviewOrder, setReviewOrder] = useState(null)

  const load = async () => {
    setLoading(true)
    try { const { data } = await orderAPI.getMyOrders(); setOrders(data) }
    catch { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const cancel = async (id) => {
    if (!confirm('Cancel this order?')) return
    try {
      await orderAPI.updateStatus(id, 'cancelled')
      toast.success('Order cancelled')
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: 'cancelled' } : o))
    } catch { toast.error('Cannot cancel') }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-500 mt-1">Track all your purchase orders</p>
      </div>
      <div className="flex gap-2 flex-wrap mb-6">
        {['all','pending','confirmed','shipped','delivered','cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${filter === s ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {s}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24"><div className="text-6xl mb-4">📦</div><p className="text-gray-400">No orders found</p></div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <div key={order._id} className="card hover:shadow-card-hover transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-earth-100 rounded-xl overflow-hidden flex-shrink-0">
                  {order.cropId?.imageUrl ? <img src={order.cropId.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">🌾</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.cropId?.cropName}</h3>
                      <p className="text-sm text-gray-500">Farmer: {order.farmerId?.fullName}{order.farmerId?.phone && ` · ${order.farmerId.phone}`}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-primary-700 font-bold">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                        <span className="text-gray-400 text-sm">({order.quantity} kg)</span>
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  {order.deliveryAddress && <p className="text-xs text-gray-400 mt-1">📍 {order.deliveryAddress}</p>}
                </div>
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  {order.status === 'pending' && (
                    <button onClick={() => cancel(order._id)} className="btn-secondary text-xs py-2 px-3 text-red-500 border-red-200 hover:bg-red-50">Cancel</button>
                  )}
                  {order.status === 'confirmed' && (
                    <button onClick={() => setPayOrder(order)} className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5">
                      <CreditCard size={13} /> Pay Now
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <button onClick={() => setReviewOrder(order)} className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 text-yellow-600 border-yellow-200 hover:bg-yellow-50">
                      <Star size={13} /> Review
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-100">{new Date(order.orderAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          ))}
        </div>
      )}
      {payOrder && <PaymentModal order={payOrder} onClose={() => setPayOrder(null)} onSuccess={load} />}
      {reviewOrder && <ReviewModal order={reviewOrder} onClose={() => setReviewOrder(null)} onSuccess={load} />}
    </DashboardLayout>
  )
}
