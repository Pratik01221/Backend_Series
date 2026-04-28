import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sprout, Menu, X, MessageSquare, LogOut, LayoutDashboard, ShoppingBag, Gavel, Wheat } from 'lucide-react'
import { useState } from 'react'
import useAuthStore from '../../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const dashboardLink = user?.role === 'farmer' ? '/farmer/dashboard'
    : user?.role === 'trader' ? '/trader/dashboard'
    : '/admin/dashboard'

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
              <Sprout size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900">KrushiSetu</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/marketplace" current={location.pathname}>Marketplace</NavLink>
            {user && <NavLink to={dashboardLink} current={location.pathname}>Dashboard</NavLink>}
            {user?.role === 'farmer' && <NavLink to="/farmer/crops" current={location.pathname}>My Crops</NavLink>}
            {user?.role === 'farmer' && <NavLink to="/farmer/bids" current={location.pathname}>Bids</NavLink>}
            {user?.role === 'trader' && <NavLink to="/trader/bids" current={location.pathname}>My Bids</NavLink>}
            {(user?.role === 'farmer' || user?.role === 'trader') && (
              <Link to="/messages" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MessageSquare size={18} className="text-gray-600" />
              </Link>
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl">
                  <div className="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-xs">{user.fullName?.[0]?.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900 leading-none">{user.fullName}</p>
                    <p className="text-xs text-gray-500 capitalize leading-none mt-0.5">{user.role}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-lg transition-colors group">
                  <LogOut size={17} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          <MobileLink to="/marketplace" onClick={() => setOpen(false)}>🌾 Marketplace</MobileLink>
          {user && <MobileLink to={dashboardLink} onClick={() => setOpen(false)}>📊 Dashboard</MobileLink>}
          {user?.role === 'farmer' && <MobileLink to="/farmer/crops" onClick={() => setOpen(false)}>🌱 My Crops</MobileLink>}
          {user?.role === 'farmer' && <MobileLink to="/farmer/bids" onClick={() => setOpen(false)}>🔨 Bids</MobileLink>}
          {user?.role === 'trader' && <MobileLink to="/trader/bids" onClick={() => setOpen(false)}>🔨 My Bids</MobileLink>}
          {user && <MobileLink to="/messages" onClick={() => setOpen(false)}>💬 Messages</MobileLink>}
          {!user ? (
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="btn-secondary text-sm w-full text-center" onClick={() => setOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn-primary text-sm w-full text-center" onClick={() => setOpen(false)}>Register</Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="w-full text-left text-red-500 py-2 px-3 text-sm font-medium">Sign Out</button>
          )}
        </div>
      )}
    </nav>
  )
}

const NavLink = ({ to, current, children }) => (
  <Link to={to} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${current === to ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
    {children}
  </Link>
)

const MobileLink = ({ to, onClick, children }) => (
  <Link to={to} onClick={onClick} className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">{children}</Link>
)
