import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sprout } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function Register() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', role: 'farmer', phone: '',
    farmLocation: '', farmSize: '', cropsGrown: '',
    companyName: '', businessLicense: '', location: '',
  })
  const { register, loading } = useAuthStore()
  const navigate = useNavigate()

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, cropsGrown: form.cropsGrown.split(',').map(c => c.trim()).filter(Boolean) }
      const user = await register(payload)
      toast.success('Account created successfully!')
      if (user.role === 'farmer') navigate('/farmer/dashboard')
      else navigate('/trader/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-earth-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <Sprout size={22} className="text-white" />
          </div>
          <span className="font-display font-bold text-2xl text-gray-900">KrushiSetu</span>
        </Link>

        <div className="card shadow-card-hover">
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Create account</h1>
          <p className="text-gray-500 text-sm mb-6">Join the agricultural marketplace</p>

          {/* Role selector */}
          <div className="flex gap-3 mb-6">
            {['farmer', 'trader'].map(r => (
              <button key={r} type="button" onClick={() => set('role', r)}
                className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium capitalize transition-all ${
                  form.role === r ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}>
                {r === 'farmer' ? '🌾 Farmer' : '🏪 Trader'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input className="input" placeholder="Ramesh Kumar" value={form.fullName}
                  onChange={e => set('fullName', e.target.value)} required />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" placeholder="9876543210" value={form.phone}
                  onChange={e => set('phone', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email}
                onChange={e => set('email', e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="Min. 6 characters" value={form.password}
                onChange={e => set('password', e.target.value)} required minLength={6} />
            </div>

            {/* Farmer fields */}
            {form.role === 'farmer' && (
              <>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Farm Details</p>
                </div>
                <div>
                  <label className="label">Farm Location</label>
                  <input className="input" placeholder="e.g. Nashik, Maharashtra" value={form.farmLocation}
                    onChange={e => set('farmLocation', e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Farm Size</label>
                    <input className="input" placeholder="e.g. 5 acres" value={form.farmSize}
                      onChange={e => set('farmSize', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Crops Grown</label>
                    <input className="input" placeholder="wheat, rice, tomato" value={form.cropsGrown}
                      onChange={e => set('cropsGrown', e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {/* Trader fields */}
            {form.role === 'trader' && (
              <>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Business Details</p>
                </div>
                <div>
                  <label className="label">Company Name</label>
                  <input className="input" placeholder="Agro Traders Pvt Ltd" value={form.companyName}
                    onChange={e => set('companyName', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Business License</label>
                    <input className="input" placeholder="License number" value={form.businessLicense}
                      onChange={e => set('businessLicense', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Location</label>
                    <input className="input" placeholder="e.g. Pune, Maharashtra" value={form.location}
                      onChange={e => set('location', e.target.value)} required />
                  </div>
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
