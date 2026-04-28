import { useState, useEffect } from 'react'
import { User, MapPin, Phone, Mail, Star, Pencil, Check, X } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { farmerAPI, traderAPI } from '../../api/services'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const isFarmer = user?.role === 'farmer'

  const load = async () => {
    setLoading(true)
    try {
      const { data } = isFarmer
        ? await farmerAPI.getProfile(user._id)
        : await traderAPI.getProfile(user._id)
      setProfile(data)
      setForm({
        fullName: data.userId?.fullName || user.fullName,
        phone: data.userId?.phone || user.phone || '',
        bio: data.bio || '',
        farmLocation: data.farmLocation || '',
        farmSize: data.farmSize || '',
        cropsGrown: (data.cropsGrown || []).join(', '),
        companyName: data.companyName || '',
        businessLicense: data.businessLicense || '',
        location: data.location || '',
      })
    } catch {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    try {
      const payload = {
        ...form,
        cropsGrown: form.cropsGrown ? form.cropsGrown.split(',').map(c => c.trim()).filter(Boolean) : [],
      }
      isFarmer ? await farmerAPI.updateProfile(payload) : await traderAPI.updateProfile(payload)
      toast.success('Profile updated!')
      setEditing(false)
      load()
    } catch {
      toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star key={i} size={14} className={i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
    ))

  if (loading) return <DashboardLayout><p className="text-gray-400">Loading...</p></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1">Manage your account details</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2">
            <Pencil size={15} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="btn-secondary flex items-center gap-2">
              <X size={15} /> Cancel
            </button>
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2">
              <Check size={15} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <div className="card text-center">
          <div className="w-24 h-24 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-700 font-bold text-4xl">{user?.fullName?.[0]?.toUpperCase()}</span>
          </div>
          <h2 className="font-display font-bold text-xl text-gray-900">{user?.fullName}</h2>
          <p className="text-primary-600 font-medium capitalize text-sm mt-0.5">{user?.role}</p>
          <div className="flex justify-center gap-0.5 mt-2">
            {renderStars(profile?.rating || 0)}
            <span className="text-xs text-gray-500 ml-1">{profile?.rating ? `${profile.rating} (${profile.totalRatings})` : 'No ratings yet'}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-left">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail size={14} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} className="text-gray-400 flex-shrink-0" />
                <span>{user.phone}</span>
              </div>
            )}
            {(profile?.farmLocation || profile?.location) && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                <span>{profile.farmLocation || profile.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Details card */}
        <div className="lg:col-span-2 card">
          <h3 className="font-display font-bold text-gray-900 mb-5">
            {isFarmer ? 'Farm Details' : 'Business Details'}
          </h3>

          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input className="input" value={form.fullName} onChange={e => set('fullName', e.target.value)} />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Bio</label>
                <textarea className="input resize-none" rows={2} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Tell buyers about yourself..." />
              </div>
              {isFarmer ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Farm Location</label>
                      <input className="input" value={form.farmLocation} onChange={e => set('farmLocation', e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Farm Size</label>
                      <input className="input" placeholder="e.g. 10 acres" value={form.farmSize} onChange={e => set('farmSize', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Crops Grown (comma separated)</label>
                    <input className="input" placeholder="wheat, rice, tomatoes" value={form.cropsGrown} onChange={e => set('cropsGrown', e.target.value)} />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Company Name</label>
                      <input className="input" value={form.companyName} onChange={e => set('companyName', e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Business License</label>
                      <input className="input" value={form.businessLicense} onChange={e => set('businessLicense', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Location</label>
                    <input className="input" value={form.location} onChange={e => set('location', e.target.value)} />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {profile?.bio && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 italic">"{profile.bio}"</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {isFarmer ? (
                  <>
                    <InfoRow label="Farm Location" value={profile?.farmLocation} />
                    <InfoRow label="Farm Size" value={profile?.farmSize} />
                    <div className="col-span-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Crops Grown</p>
                      <div className="flex flex-wrap gap-2">
                        {(profile?.cropsGrown || []).map(c => (
                          <span key={c} className="badge-green capitalize">{c}</span>
                        ))}
                        {(!profile?.cropsGrown?.length) && <span className="text-sm text-gray-400">Not specified</span>}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <InfoRow label="Company" value={profile?.companyName} />
                    <InfoRow label="License No." value={profile?.businessLicense} />
                    <InfoRow label="Location" value={profile?.location} />
                  </>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <InfoRow label="Rating" value={`${profile?.rating || 0} / 5 (${profile?.totalRatings || 0} reviews)`} />
                <InfoRow label="Member Since" value={new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} />
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || '—'}</p>
    </div>
  )
}
