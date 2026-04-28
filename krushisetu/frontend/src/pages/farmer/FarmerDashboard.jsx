import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ArrowRight, ShoppingCart, Gavel, TrendingUp } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import StatCard from '../../components/common/StatCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { SkeletonStat, SkeletonRow } from '../../components/common/Skeleton'
import EmptyState from '../../components/common/EmptyState'
import { cropAPI, orderAPI, bidAPI } from '../../api/services'
import { formatINR, formatDate, timeAgo } from '../../utils/helpers'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function FarmerDashboard() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ crops: 0, orders: 0, pendingBids: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [recentBids, setRecentBids] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [cropsRes, ordersRes, bidsRes] = await Promise.all([
          cropAPI.getMyCrops(),
          orderAPI.getMyOrders(),
          bidAPI.getMyBids(),
        ])
        const orders = ordersRes.data
        const bids   = bidsRes.data
        const revenue = orders
          .filter(o => o.status === 'delivered')
          .reduce((s, o) => s + (o.totalPrice || 0), 0)

        setStats({
          crops:       cropsRes.data.length,
          orders:      orders.length,
          pendingBids: bids.filter(b => b.status === 'pending').length,
          revenue,
        })
        setRecentOrders(orders.slice(0, 5))
        setRecentBids(bids.filter(b => b.status === 'pending').slice(0, 5))
      } catch {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const firstName = user?.fullName?.split(' ')[0] || 'Farmer'

  return (
    <DashboardLayout>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">
          Good day, {firstName} 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Here's your farm activity overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading
          ? [...Array(4)].map((_, i) => <SkeletonStat key={i} />)
          : <>
              <StatCard label="My Crops"     value={stats.crops}              icon="🌾" color="primary" />
              <StatCard label="Total Orders" value={stats.orders}             icon="📦" color="blue"    />
              <StatCard label="Pending Bids" value={stats.pendingBids}        icon="🔨" color="earth"   />
              <StatCard label="Revenue"      value={formatINR(stats.revenue)} icon="💰" color="purple"  />
            </>
        }
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Link to="/farmer/crops"
          className="card border-2 border-dashed border-primary-200 hover:border-primary-500 hover:bg-primary-50 transition-all group text-center py-8 cursor-pointer">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-200 transition-colors">
            <Plus size={22} className="text-primary-600" />
          </div>
          <p className="font-semibold text-gray-800">Add New Crop</p>
          <p className="text-xs text-gray-400 mt-1">List a crop for traders</p>
        </Link>

        <Link to="/farmer/orders"
          className="card hover:shadow-card-hover transition-all group flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <ShoppingCart size={20} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800">Manage Orders</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {recentOrders.filter(o => o.status === 'pending').length} pending
            </p>
          </div>
          <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
        </Link>

        <Link to="/farmer/bids"
          className="card hover:shadow-card-hover transition-all group flex items-center gap-4">
          <div className="w-12 h-12 bg-earth-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Gavel size={20} className="text-earth-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800">Incoming Bids</p>
            <p className="text-xs text-gray-400 mt-0.5">{stats.pendingBids} need response</p>
          </div>
          <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
        </Link>
      </div>

      {/* Recent panels */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-gray-900">Recent Orders</h2>
            <Link to="/farmer/orders" className="text-sm text-primary-600 hover:underline">View all</Link>
          </div>
          {loading
            ? <div className="space-y-3">{[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}</div>
            : recentOrders.length === 0
              ? <EmptyState emoji="📦" title="No orders yet" description="Once traders place orders you'll see them here." />
              : <div className="space-y-2">
                  {recentOrders.map(order => (
                    <div key={order._id} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                        {order.cropId?.imageUrl
                          ? <img src={order.cropId.imageUrl} className="w-full h-full object-cover" />
                          : '🌾'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{order.cropId?.cropName}</p>
                        <p className="text-xs text-gray-400">{order.quantity} kg · {formatINR(order.totalPrice)} · {timeAgo(order.createdAt)}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                  ))}
                </div>
          }
        </div>

        {/* Pending Bids */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-gray-900">Bids to Review</h2>
            <Link to="/farmer/bids" className="text-sm text-primary-600 hover:underline">View all</Link>
          </div>
          {loading
            ? <div className="space-y-3">{[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}</div>
            : recentBids.length === 0
              ? <EmptyState emoji="🔨" title="No pending bids" description="Bids on your bidding crops will appear here." />
              : <div className="space-y-2">
                  {recentBids.map(bid => (
                    <div key={bid._id} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                      <div className="w-10 h-10 bg-earth-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                        {bid.cropId?.imageUrl
                          ? <img src={bid.cropId.imageUrl} className="w-full h-full object-cover" />
                          : '🌾'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{bid.cropId?.cropName}</p>
                        <p className="text-xs text-gray-400">{formatINR(bid.bidAmount)}/kg · {bid.quantity} kg</p>
                      </div>
                      <StatusBadge status={bid.status} />
                    </div>
                  ))}
                </div>
          }
        </div>
      </div>
    </DashboardLayout>
  )
}
