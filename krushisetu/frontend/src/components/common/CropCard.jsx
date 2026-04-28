import { Link } from 'react-router-dom'
import { MapPin, Weight, IndianRupee, Tag, Gavel } from 'lucide-react'

const categoryColors = {
  vegetables: 'badge-green',
  fruits: 'badge-yellow',
  grains: 'badge-blue',
  pulses: 'badge-blue',
  spices: 'badge-red',
  oilseeds: 'badge-yellow',
  others: 'badge-gray',
}

export default function CropCard({ crop }) {
  return (
    <Link to={`/crops/${crop._id}`} className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-44 bg-gradient-to-br from-primary-100 to-earth-100 overflow-hidden">
        {crop.imageUrl ? (
          <img src={crop.imageUrl} alt={crop.cropName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🌾</div>
        )}
        <div className="absolute top-3 left-3">
          <span className={categoryColors[crop.category] || 'badge-gray'}>{crop.category}</span>
        </div>
        {crop.sellingType === 'bidding' && (
          <div className="absolute top-3 right-3 bg-earth-500 text-white text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
            <Gavel size={11} /> Bidding
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display font-semibold text-gray-900 text-lg leading-tight mb-1 group-hover:text-primary-700 transition-colors">
          {crop.cropName}
        </h3>
        <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
          <MapPin size={11} /> {crop.location}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-primary-700">
            <IndianRupee size={14} className="text-primary-600" />
            <span className="font-bold text-lg">{crop.pricePerKg}</span>
            <span className="text-xs text-gray-400">/kg</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Weight size={12} />
            {crop.quantity - (crop.soldQuantity || 0)} kg
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">By {crop.farmerId?.fullName || 'Farmer'}</span>
          <span className={`text-xs font-medium ${crop.status === 'available' ? 'text-primary-600' : 'text-red-500'}`}>
            {crop.status === 'available' ? '✓ Available' : crop.status}
          </span>
        </div>
      </div>
    </Link>
  )
}
