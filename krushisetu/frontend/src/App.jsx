import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useAuthStore from './store/authStore'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Shared
import Landing from './pages/shared/Landing'
import Marketplace from './pages/shared/Marketplace'
import CropDetail from './pages/shared/CropDetail'
import Messages from './pages/shared/Messages'
import Profile from './pages/shared/Profile'
import NotFound from './pages/shared/NotFound'
import Payments from './pages/shared/Payments'

// Farmer
import FarmerDashboard from './pages/farmer/FarmerDashboard'
import FarmerCrops from './pages/farmer/FarmerCrops'
import FarmerOrders from './pages/farmer/FarmerOrders'
import FarmerBids from './pages/farmer/FarmerBids'

// Trader
import TraderDashboard from './pages/trader/TraderDashboard'
import TraderOrders from './pages/trader/TraderOrders'
import TraderBids from './pages/trader/TraderBids'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCrops from './pages/admin/AdminCrops'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProfile from './pages/admin/AdminProfile'

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/crops/:id" element={<CropDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Farmer */}
        <Route path="/farmer/dashboard" element={<PrivateRoute roles={['farmer']}><FarmerDashboard /></PrivateRoute>} />
        <Route path="/farmer/crops"     element={<PrivateRoute roles={['farmer']}><FarmerCrops /></PrivateRoute>} />
        <Route path="/farmer/orders"    element={<PrivateRoute roles={['farmer']}><FarmerOrders /></PrivateRoute>} />
        <Route path="/farmer/bids"      element={<PrivateRoute roles={['farmer']}><FarmerBids /></PrivateRoute>} />

        {/* Trader */}
        <Route path="/trader/dashboard" element={<PrivateRoute roles={['trader']}><TraderDashboard /></PrivateRoute>} />
        <Route path="/trader/orders"    element={<PrivateRoute roles={['trader']}><TraderOrders /></PrivateRoute>} />
        <Route path="/trader/bids"      element={<PrivateRoute roles={['trader']}><TraderBids /></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/users"     element={<PrivateRoute roles={['admin']}><AdminUsers /></PrivateRoute>} />
        <Route path="/admin/crops"     element={<PrivateRoute roles={['admin']}><AdminCrops /></PrivateRoute>} />
        <Route path="/admin/orders"    element={<PrivateRoute roles={['admin']}><AdminOrders /></PrivateRoute>} />
        <Route path="/admin/profile"   element={<PrivateRoute roles={['admin']}><AdminProfile /></PrivateRoute>} />

        {/* Shared protected */}
        <Route path="/messages" element={<PrivateRoute roles={['farmer','trader']}><Messages /></PrivateRoute>} />
        <Route path="/profile"  element={<PrivateRoute roles={['farmer','trader']}><Profile /></PrivateRoute>} />
        <Route path="/payments" element={<PrivateRoute roles={['farmer','trader']}><Payments /></PrivateRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
