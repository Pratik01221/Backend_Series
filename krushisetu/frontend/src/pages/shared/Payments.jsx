import { useState, useEffect } from 'react'
import { CreditCard, TrendingUp, TrendingDown } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { StatusBadge } from '../../components/common/StatusBadge'
import { SkeletonRow } from '../../components/common/Skeleton'
import { paymentAPI } from '../../api/services'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const methodIcons = {
  razorpay: '💳',
  upi: '📱',
  bank_transfer: '🏦',
  cash: '💵',
}

export default function Payments() {
  const { user } = useAuthStore()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    paymentAPI.getMy()
      .then(r => setPayments(r.data))
      .catch(() => toast.error('Failed to load payments'))
      .finally(() => setLoading(false))
  }, [])

  const totalCompleted = payments
    .filter(p => p.status === 'completed')
    .reduce((s, p) => s + p.totalPrice, 0)

  const isFarmer = user?.role === 'farmer'

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">
          {isFarmer ? 'Payment Received' : 'Payment History'}
        </h1>
        <p className="text-gray-500 mt-1">All transactions on your account</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <CreditCard size={20} className="text-primary-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
            <p className="text-sm text-gray-500">Total Transactions</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isFarmer ? 'bg-green-100' : 'bg-red-100'}`}>
            {isFarmer
              ? <TrendingUp size={20} className="text-green-600" />
              : <TrendingDown size={20} className="text-red-500" />
            }
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">₹{totalCompleted.toLocaleString('en-IN')}</p>
            <p className="text-sm text-gray-500">{isFarmer ? 'Total Received' : 'Total Paid'}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl">⏳</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {payments.filter(p => p.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="font-display text-xl text-gray-500 mb-2">No transactions yet</h3>
          <p className="text-gray-400 text-sm">
            {isFarmer ? 'Payments will appear here once orders are completed' : 'Complete an order to see your payment history'}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Transaction', isFarmer ? 'From (Trader)' : 'To (Farmer)', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map(pay => (
                  <tr key={pay._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-xs font-mono text-gray-500">
                        {pay.transactionId || pay._id.slice(-10).toUpperCase()}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">
                      {isFarmer ? pay.traderId?.fullName : pay.farmerId?.fullName}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-bold text-sm ${isFarmer ? 'text-green-600' : 'text-red-500'}`}>
                        {isFarmer ? '+' : '-'}₹{pay.totalPrice?.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 flex items-center gap-1.5">
                      <span>{methodIcons[pay.method] || '💳'}</span>
                      <span className="capitalize">{pay.method?.replace('_', ' ')}</span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={pay.status} />
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                      {pay.paidAt
                        ? new Date(pay.paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
