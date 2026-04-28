import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sprout, LayoutDashboard, Wheat, ShoppingCart, Gavel, MessageSquare, CreditCard, LogOut, Users, Settings, BarChart3, X } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const farmerLinks = [
  { to: '/farmer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/farmer/crops',     icon: Wheat,           label: 'My Crops' },
  { to: '/farmer/orders',    icon: ShoppingCart,    label: 'Orders' },
  { to: '/farmer/bids',      icon: Gavel,           label: 'Bids' },
  { to: '/payments',         icon: CreditCard,      label: 'Payments' },
  { to: '/messages',         icon: MessageSquare,   label: 'Messages' },
  { to: '/profile',          icon: Settings,        label: 'Profile' },
]

const traderLinks = [
  { to: '/trader/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/marketplace',      icon: Wheat,           label: 'Marketplace' },
  { to: '/trader/orders',    icon: ShoppingCart,    label: 'My Orders' },
  { to: '/trader/bids',      icon: Gavel,           label: 'My Bids' },
  { to: '/payments',         icon: CreditCard,      label: 'Payments' },
  { to: '/messages',         icon: MessageSquare,   label: 'Messages' },
  { to: '/profile',          icon: Settings,        label: 'Profile' },
]

const adminLinks = [
  { to: '/admin/dashboard', icon: BarChart3,     label: 'Overview' },
  { to: '/admin/users',     icon: Users,         label: 'Users' },
  { to: '/admin/crops',     icon: Wheat,         label: 'Crops' },
  { to: '/admin/orders',    icon: ShoppingCart,  label: 'Orders' },
  { to: '/admin/profile',   icon: Settings,      label: 'Settings' },
]

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const links = user?.role === 'farmer' ? farmerLinks : user?.role === 'trader' ? traderLinks : adminLinks

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Logo + mobile close */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Sprout size={17} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-gray-900">KrushiSetu</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg">
            <X size={18} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 bg-primary-50 rounded-xl px-3 py-3">
          <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {user?.fullName?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName}</p>
            <p className="text-xs text-primary-600 capitalize font-medium">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to
          return (
            <Link key={to} to={to} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}>
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button onClick={() => { logout(); navigate('/') }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all">
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
