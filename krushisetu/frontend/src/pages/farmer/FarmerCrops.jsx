import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Image } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { StatusBadge } from '../../components/common/StatusBadge'
import { SkeletonCard } from '../../components/common/Skeleton'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { cropAPI } from '../../api/services'
import { formatINR, formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  cropName: '', category: 'vegetables', quantity: '', pricePerKg: '',
  sellingType: 'fixed', location: '', description: '', harvestDate: '',
  minimumBidAmount: '', biddingEndDate: '',
}

export default function FarmerCrops() {
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirm, setConfirm] = useState(null)

  const load = async () => {
    setLoading(true)
    try { const { data } = await cropAPI.getMyCrops(); setCrops(data) }
    catch { toast.error('Failed to load crops') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openAdd  = () => { setForm(EMPTY_FORM); setEditing(null); setImageFile(null); setModal(true) }
  const openEdit = (crop) => {
    setForm({
      cropName: crop.cropName, category: crop.category, quantity: crop.quantity,
      pricePerKg: crop.pricePerKg, sellingType: crop.sellingType, location: crop.location,
      description: crop.description || '', harvestDate: crop.harvestDate?.slice(0, 10) || '',
      minimumBidAmount: crop.minimumBidAmount || '', biddingEndDate: crop.biddingEndDate?.slice(0, 10) || '',
    })
    setEditing(crop._id)
    setImageFile(null)
    setModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editing) {
        await cropAPI.update(editing, form)
        toast.success('Crop updated!')
      } else {
        const fd = new FormData()
        Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v) })
        if (imageFile) fd.append('image', imageFile)
        await cropAPI.create(fd)
        toast.success('Crop listed successfully!')
      }
      setModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save crop')
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = (id, name) => {
    setConfirm({
      title: 'Delete crop listing?',
      message: `"${name}" will be permanently removed from the marketplace.`,
      confirmLabel: 'Delete',
      danger: true,
      icon: '🗑️',
      onConfirm: () => deleteCrop(id),
    })
  }

  const deleteCrop = async (id) => {
    try { await cropAPI.delete(id); toast.success('Crop deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">My Crops</h1>
          <p className="text-gray-500 mt-1 text-sm">{crops.length} listings</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Crop
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : crops.length === 0 ? (
        <EmptyState
          emoji="🌱"
          title="No crops listed yet"
          description="Start by adding your first crop listing to the marketplace."
          actionLabel="Add Your First Crop"
          onAction={openAdd}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {crops.map(crop => (
            <div key={crop._id} className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all group">
              {/* Image */}
              <div className="relative h-40 bg-gradient-to-br from-primary-100 to-earth-100">
                {crop.imageUrl
                  ? <img src={crop.imageUrl} alt={crop.cropName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="w-full h-full flex items-center justify-center text-5xl">🌾</div>
                }
                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <button onClick={() => openEdit(crop)}
                    className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Pencil size={13} className="text-gray-600" />
                  </button>
                  <button onClick={() => confirmDelete(crop._id, crop.cropName)}
                    className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center hover:bg-red-50 transition-colors">
                    <Trash2 size={13} className="text-red-500" />
                  </button>
                </div>
                <div className="absolute top-2 left-2">
                  <StatusBadge status={crop.status} />
                </div>
                {crop.sellingType === 'bidding' && (
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-earth-500 text-white text-xs font-semibold px-2 py-0.5 rounded-lg">Bidding</span>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-4">
                <h3 className="font-display font-bold text-gray-900 truncate">{crop.cropName}</h3>
                <p className="text-xs text-gray-400 capitalize mt-0.5 mb-3">{crop.category} · {crop.location}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary-700 font-bold text-lg">
                    {formatINR(crop.pricePerKg)}<span className="text-gray-400 font-normal text-xs">/kg</span>
                  </span>
                  <span className="text-gray-400 text-xs">{crop.quantity} kg left</span>
                </div>
                {crop.harvestDate && (
                  <p className="text-xs text-gray-400 mt-2">🗓 Harvest: {formatDate(crop.harvestDate)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center px-4 py-8 overflow-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl my-auto">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 className="font-display text-xl font-bold">{editing ? 'Edit Crop' : 'Add New Crop'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Crop Name *</label>
                  <input className="input" placeholder="e.g. Tomatoes" value={form.cropName}
                    onChange={e => set('cropName', e.target.value)} required />
                </div>
                <div>
                  <label className="label">Category *</label>
                  <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
                    {['vegetables','fruits','grains','pulses','spices','oilseeds','others'].map(c =>
                      <option key={c} value={c} className="capitalize">{c}</option>
                    )}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Quantity (kg) *</label>
                  <input className="input" type="number" min="1" placeholder="e.g. 500"
                    value={form.quantity} onChange={e => set('quantity', e.target.value)} required />
                </div>
                <div>
                  <label className="label">Price / kg (₹) *</label>
                  <input className="input" type="number" min="1" placeholder="e.g. 25"
                    value={form.pricePerKg} onChange={e => set('pricePerKg', e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Selling Type</label>
                  <select className="input" value={form.sellingType} onChange={e => set('sellingType', e.target.value)}>
                    <option value="fixed">Fixed Price</option>
                    <option value="bidding">Bidding</option>
                  </select>
                </div>
                <div>
                  <label className="label">Location *</label>
                  <input className="input" placeholder="e.g. Nashik, MH"
                    value={form.location} onChange={e => set('location', e.target.value)} required />
                </div>
              </div>
              {form.sellingType === 'bidding' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Min Bid (₹/kg)</label>
                    <input className="input" type="number" value={form.minimumBidAmount}
                      onChange={e => set('minimumBidAmount', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Bidding End Date</label>
                    <input className="input" type="date" value={form.biddingEndDate}
                      onChange={e => set('biddingEndDate', e.target.value)} />
                  </div>
                </div>
              )}
              <div>
                <label className="label">Harvest Date</label>
                <input className="input" type="date" value={form.harvestDate}
                  onChange={e => set('harvestDate', e.target.value)} />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input resize-none" rows={2}
                  placeholder="Quality notes, storage info, special highlights…"
                  value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
              {!editing && (
                <div>
                  <label className="label">Crop Image</label>
                  <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-primary-300 transition-colors">
                    <Image size={18} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-500 truncate">
                      {imageFile ? imageFile.name : 'Click to upload image (JPG, PNG, WebP)'}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
                  </label>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1">
                  {submitting ? 'Saving…' : editing ? 'Update Crop' : 'List Crop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog state={confirm} onClose={() => setConfirm(null)} />
    </DashboardLayout>
  )
}
