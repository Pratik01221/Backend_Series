import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { StatusBadge } from '../../components/common/StatusBadge'
import { adminAPI } from '../../api/services'

export default function AdminCrops() {
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { adminAPI.getCrops().then(r => setCrops(r.data)).finally(() => setLoading(false)) }, [])

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Crop Listings</h1>
        <p className="text-gray-500 mt-1">{crops.length} crops listed on platform</p>
      </div>
      {loading ? <p className="text-gray-400">Loading...</p> : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Crop','Farmer','Category','Qty (kg)','Price/kg','Type','Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {crops.map(c => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-sm text-gray-900">{c.cropName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{c.farmerId?.fullName}</td>
                  <td className="px-4 py-3 text-sm capitalize text-gray-500">{c.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.quantity}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-primary-700">₹{c.pricePerKg}</td>
                  <td className="px-4 py-3"><span className="badge-gray capitalize">{c.sellingType}</span></td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
