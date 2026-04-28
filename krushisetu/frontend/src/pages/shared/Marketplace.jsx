import { useState, useEffect, useCallback } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import CropCard from '../../components/common/CropCard'
import { SkeletonCard } from '../../components/common/Skeleton'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import { cropAPI } from '../../api/services'
import { useDebounce } from '../../hooks/useDebounce'
import toast from 'react-hot-toast'

const CATEGORIES = ['all', 'vegetables', 'fruits', 'grains', 'pulses', 'spices', 'oilseeds', 'others']
const LIMIT = 12

export default function Marketplace() {
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [sellingType, setSellingType] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const debouncedSearch = useDebounce(search, 450)

  const fetchCrops = useCallback(async (resetPage = false) => {
    const currentPage = resetPage ? 1 : page
    if (resetPage) setPage(1)
    setLoading(true)
    try {
      const params = { page: currentPage, limit: LIMIT }
      if (debouncedSearch) params.search = debouncedSearch
      if (category) params.category = category
      if (location) params.location = location
      if (sellingType) params.sellingType = sellingType
      if (minPrice) params.minPrice = minPrice
      if (maxPrice) params.maxPrice = maxPrice

      const { data } = await cropAPI.getAll(params)
      setCrops(data.crops)
      setTotal(data.total)
    } catch {
      toast.error('Failed to load crops')
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, category, location, sellingType, minPrice, maxPrice])

  // Re-fetch when page or debounced search changes
  useEffect(() => { fetchCrops() }, [page, debouncedSearch, category, sellingType])

  const applyFilters = (e) => {
    e.preventDefault()
    fetchCrops(true)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setLocation('')
    setSellingType('')
    setMinPrice('')
    setMaxPrice('')
    setPage(1)
  }

  const hasActiveFilters = category || location || sellingType || minPrice || maxPrice

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero header */}
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold mb-1">Crop Marketplace</h1>
          <p className="text-primary-200 mb-7 text-sm">
            Fresh produce listed directly by farmers across India
          </p>

          {/* Search bar */}
          <div className="flex gap-2 max-w-2xl">
            <div className="flex-1 relative">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                className="input pl-10 w-full shadow-sm"
                placeholder="Search crops, category, location…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium ${
                showFilters || hasActiveFilters
                  ? 'bg-white text-primary-700 border-white'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              }`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-earth-500 rounded-full text-white text-xs flex items-center justify-center">
                  ✓
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filter panel */}
        {showFilters && (
          <div className="card mb-6 border border-gray-200 shadow-sm">
            <form onSubmit={applyFilters}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
                <button type="button" onClick={clearFilters} className="text-sm text-red-500 hover:underline flex items-center gap-1">
                  <X size={13} /> Clear all
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="label">Location</label>
                  <input className="input" placeholder="e.g. Nashik" value={location} onChange={e => setLocation(e.target.value)} />
                </div>
                <div>
                  <label className="label">Selling Type</label>
                  <select className="input" value={sellingType} onChange={e => setSellingType(e.target.value)}>
                    <option value="">All</option>
                    <option value="fixed">Fixed Price</option>
                    <option value="bidding">Bidding</option>
                  </select>
                </div>
                <div>
                  <label className="label">Min Price (₹/kg)</label>
                  <input className="input" type="number" min="0" placeholder="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                </div>
                <div>
                  <label className="label">Max Price (₹/kg)</label>
                  <input className="input" type="number" min="0" placeholder="∞" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="btn-primary text-sm">Apply Filters</button>
                <button type="button" onClick={() => setShowFilters(false)} className="btn-secondary text-sm">Close</button>
              </div>
            </form>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-6 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setCategory(cat === 'all' ? '' : cat); setPage(1) }}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all flex-shrink-0 ${
                (cat === 'all' && !category) || category === cat
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            {loading ? 'Loading…' : `${total} crop${total !== 1 ? 's' : ''} found`}
            {debouncedSearch && <span className="text-primary-600 ml-1">for "{debouncedSearch}"</span>}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-red-500 hover:underline flex items-center gap-1">
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(LIMIT)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : crops.length === 0 ? (
          <EmptyState
            emoji="🔍"
            title="No crops found"
            description="Try adjusting your search or filters to find what you're looking for."
            actionLabel="Clear Filters"
            onAction={clearFilters}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {crops.map(crop => <CropCard key={crop._id} crop={crop} />)}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={Math.ceil(total / LIMIT)}
          onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        />
      </div>
    </div>
  )
}
