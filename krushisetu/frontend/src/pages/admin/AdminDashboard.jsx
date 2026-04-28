import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Wheat, ShoppingCart, TrendingUp, ArrowRight } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import StatCard from '../../components/common/StatCard'
import { SkeletonStat } from '../../components/common/Skeleton'
import { formatINR } from '../../utils/helpers'
import { adminAPI } from '../../api/services'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getUsers(),
        ])
        setStats(statsRes.data)
        setRecentUsers(usersRes.data.slice(0, 6))
      } catch {
        toast.error('Failed to load admin data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-gray-500 mt-1 text-sm">Platform statistics and management</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {loading
          ? [...Array(6)].map((_, i) => <SkeletonStat key={i} />)
          : <>
              <StatCard label="Total Users"    value={stats?.totalUsers   || 0} icon="👥" color="primary" />
              <StatCard label="Farmers"        value={stats?.totalFarmers || 0} icon="🌾" color="primary" />
              <StatCard label="Traders"        value={stats?.totalTraders || 0} icon="🏪" color="earth"   />
              <StatCard label="Crop Listings"  value={stats?.totalCrops   || 0} icon="🥬" color="blue"    />
              <StatCard label="Total Orders"   value={stats?.totalOrders  || 0} icon="📦" color="purple"  />
              <StatCard label="Platform Revenue" value={formatINR(stats?.totalRevenue || 0)} icon="💰" color="earth" />
            </>
        }
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { to: '/admin/users',  icon: '👥', label: 'Manage Users',  desc: 'Activate or deactivate accounts' },
          { to: '/admin/crops',  icon: '🌾', label: 'View Crops',    desc: 'All crop listings on platform'  },
          { to: '/admin/orders', icon: '📦', label: 'View Orders',   desc: 'All orders and their statuses'  },
        ].map(item => (
          <Link key={item.to} to={item.to}
            className="card hover:shadow-card-hover transition-all group flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-primary-50 transition-colors">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
            </div>
            <ArrowRight size={16} className="text-gray-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>

      {/* Recent signups */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-gray-900">Recent Signups</h2>
          <Link to="/admin/users" className="text-sm text-primary-600 hover:underline">View all</Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
                <div className="h-5 bg-gray-200 rounded-full w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {recentUsers.map(u => (
              <div key={u._id} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm flex-shrink-0">
                  {u.fullName?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{u.fullName}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <span className="badge-blue capitalize text-xs">{u.role}</span>
                <span className={u.isActive ? 'badge-green' : 'badge-red'}>{u.isActive ? 'Active' : 'Off'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
