import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import StatCard from '../../components/common/StatCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { SkeletonStat, SkeletonRow } from '../../components/common/Skeleton'
import EmptyState from '../../components/common/EmptyState'
import { orderAPI, bidAPI } from '../../api/services'
import { formatINR, timeAgo } from '../../utils/helpers'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function TraderDashboard() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ orders: 0, bids: 0, spent: 0, delivered: 0 })
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersRes, bidsRes] = await Promise.all([
          orderAPI.getMyOrders(),
          bidAPI.getMyBids(),
        ])
        const orders = ordersRes.data
        const bids   = bidsRes.data
        const spent  = orders
          .filter(o => o.status === 'delivered')
          .reduce((s, o) => s + (o.totalPrice || 0), 0)

        setStats({
          orders:    orders.length,
          bids:      bids.filter(b => b.status === 'pending').length,
          spent,
          delivered: orders.filter(o => o.status === 'delivered').length,
        })
        setRecentOrders(orders.slice(0, 5))
      } catch {
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const firstName = user?.fullName?.split(' ')[0] || 'Trader'

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">
          Welcome, {firstName} 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Your trading activity at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading
          ? [...Array(4)].map((_, i) => <SkeletonStat key={i} />)
          : <>
              <StatCard label="Total Orders"   value={stats.orders}           icon="📦" color="primary" />
              <StatCard label="Active Bids"    value={stats.bids}             icon="🔨" color="earth"   />
              <StatCard label="Delivered"      value={stats.delivered}        icon="✅" color="blue"    />
              <StatCard label="Total Spent"    value={formatINR(stats.spent)} icon="💰" color="purple"  />
            </>
        }
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { to: '/marketplace',   emoji: '🌾', label: 'Browse Marketplace', desc: 'Discover fresh crops'       },
          { to: '/trader/orders', emoji: '📦', label: 'My Orders',          desc: `${recentOrders.filter(o => o.status === 'pending').length} pending` },
          { to: '/trader/bids',   emoji: '🔨', label: 'My Bids',            desc: `${stats.bids} active`       },
        ].map(item => (
          <Link key={item.to} to={item.to}
            className="card hover:shadow-card-hover transition-all group flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
              {item.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
            </div>
            <ArrowRight size={16} className="text-gray-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-gray-900">Recent Orders</h2>
          <Link to="/trader/orders" className="text-sm text-primary-600 hover:underline">View all</Link>
        </div>

        {loading
          ? <div className="space-y-3">{[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}</div>
          : recentOrders.length === 0
            ? <EmptyState
                emoji="🛒"
                title="No orders yet"
                description="Browse the marketplace to place your first order."
                actionLabel="Go to Marketplace"
                actionTo="/marketplace"
              />
            : <div className="space-y-2">
                {recentOrders.map(order => (
                  <div key={order._id}
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg overflow-hidden flex-shrink-0">
                      {order.cropId?.imageUrl
                        ? <img src={order.cropId.imageUrl} className="w-full h-full object-cover" alt="" />
                        : <div className="w-full h-full flex items-center justify-center text-lg">🌾</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{order.cropId?.cropName}</p>
                      <p className="text-xs text-gray-400">
                        {order.quantity} kg · {formatINR(order.totalPrice)} · {timeAgo(order.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                ))}
              </div>
        }
      </div>
    </DashboardLayout>
  )
}
