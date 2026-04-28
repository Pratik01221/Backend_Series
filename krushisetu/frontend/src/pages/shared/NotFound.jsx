import { Link } from 'react-router-dom'
import { Sprout } from 'lucide-react'
import useAuthStore from '../../store/authStore'

export default function NotFound() {
  const { user } = useAuthStore()

  const homeLink = user?.role === 'farmer' ? '/farmer/dashboard'
    : user?.role === 'trader' ? '/trader/dashboard'
    : user?.role === 'admin' ? '/admin/dashboard'
    : '/'

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-earth-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🌾</div>
        <h1 className="font-display text-6xl font-bold text-primary-700 mb-2">404</h1>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">Page not found</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Looks like this field is empty. The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to={homeLink} className="btn-primary flex items-center gap-2">
            <Sprout size={16} /> Go Home
          </Link>
          <Link to="/marketplace" className="btn-secondary">
            Browse Crops
          </Link>
        </div>
      </div>
    </div>
  )
}
