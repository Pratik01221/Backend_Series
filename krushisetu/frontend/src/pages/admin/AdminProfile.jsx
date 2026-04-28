import { useState } from 'react'
import { ShieldCheck, Check } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import useAuthStore from '../../store/authStore'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function AdminProfile() {
  const { user } = useAuthStore()
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const changePassword = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      return toast.error('Passwords do not match')
    }
    if (form.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters')
    }
    setSaving(true)
    try {
      await api.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      toast.success('Password changed successfully')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-500 mt-1">Manage your admin account</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Admin info card */}
        <div className="card text-center">
          <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={36} className="text-primary-600" />
          </div>
          <h2 className="font-display font-bold text-xl text-gray-900">{user?.fullName}</h2>
          <p className="badge-blue mt-2">Administrator</p>
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-left text-sm text-gray-600">
            <p><span className="font-medium">Email:</span> {user?.email}</p>
            <p><span className="font-medium">Phone:</span> {user?.phone || '—'}</p>
            <p><span className="font-medium">Role:</span> Admin</p>
          </div>
        </div>

        {/* Platform stats overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Change password */}
          <div className="card">
            <h3 className="font-display font-bold text-gray-900 mb-5">Change Password</h3>
            <form onSubmit={changePassword} className="space-y-4">
              <div>
                <label className="label">Current Password</label>
                <input className="input" type="password" placeholder="••••••••"
                  value={form.currentPassword} onChange={e => set('currentPassword', e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">New Password</label>
                  <input className="input" type="password" placeholder="Min 6 chars"
                    value={form.newPassword} onChange={e => set('newPassword', e.target.value)} required />
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input className="input" type="password" placeholder="Repeat password"
                    value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} required />
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                <Check size={15} /> {saving ? 'Saving...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Quick info */}
          <div className="card">
            <h3 className="font-display font-bold text-gray-900 mb-4">Platform Info</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Platform', value: 'KrushiSetu v1.0.0' },
                { label: 'Institute', value: 'IMCC Pune (Autonomous)' },
                { label: 'Program', value: 'MCA – SEM I | A.Y. 2025-26' },
                { label: 'Stack', value: 'MERN (MongoDB, Express, React, Node)' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
