import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { StatusBadge } from '../../components/common/StatusBadge'
import { adminAPI } from '../../api/services'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { adminAPI.getOrders().then(r => setOrders(r.data)).finally(() => setLoading(false)) }, [])

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">All Orders</h1>
        <p className="text-gray-500 mt-1">{orders.length} total orders</p>
      </div>
      {loading ? <p className="text-gray-400">Loading...</p> : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Crop','Trader','Farmer','Qty','Total','Status','Date'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(o => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-sm text-gray-900">{o.cropId?.cropName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{o.traderId?.fullName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{o.farmerId?.fullName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{o.quantity} kg</td>
                  <td className="px-4 py-3 text-sm font-semibold text-primary-700">₹{o.totalPrice?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(o.orderAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
