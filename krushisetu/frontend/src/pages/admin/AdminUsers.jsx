import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { SkeletonTable } from '../../components/common/Skeleton'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import { adminAPI } from '../../api/services'
import { formatDate } from '../../utils/helpers'
import { useDebounce } from '../../hooks/useDebounce'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [confirm, setConfirm] = useState(null)

  const debouncedSearch = useDebounce(search, 300)

  const load = () =>
    adminAPI.getUsers()
      .then(r => setUsers(r.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const promptToggle = (user) => {
    setConfirm({
      title: user.isActive ? 'Deactivate user?' : 'Activate user?',
      message: user.isActive
        ? `${user.fullName} will lose access to the platform.`
        : `${user.fullName} will regain access to the platform.`,
      confirmLabel: user.isActive ? 'Deactivate' : 'Activate',
      danger: user.isActive,
      onConfirm: () => toggle(user._id),
    })
  }

  const toggle = async (id) => {
    try { await adminAPI.toggleUser(id); toast.success('User status updated'); load() }
    catch { toast.error('Failed to update user') }
  }

  const filtered = users.filter(u => {
    const matchRole   = roleFilter === 'all' || u.role === roleFilter
    const matchSearch = !debouncedSearch ||
      u.fullName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
    return matchRole && matchSearch
  })

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 mt-1 text-sm">{users.length} registered users</p>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input className="input pl-9" placeholder="Search by name or email…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['all', 'farmer', 'trader', 'admin'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                roleFilter === r ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={6} />
      ) : filtered.length === 0 ? (
        <EmptyState emoji="👥" title="No users found" description="Try adjusting your search or filter." />
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['User', 'Email', 'Role', 'Phone', 'Joined', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-700 font-bold text-xs flex-shrink-0">
                          {u.fullName?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-sm text-gray-900 whitespace-nowrap">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-[180px] truncate">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${
                        u.role === 'farmer' ? 'bg-primary-100 text-primary-700'
                        : u.role === 'trader' ? 'bg-earth-100 text-earth-700'
                        : 'bg-purple-100 text-purple-700'
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{u.phone || '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={u.isActive ? 'badge-green' : 'badge-red'}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.role !== 'admin' && (
                        <button onClick={() => promptToggle(u)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                            u.isActive
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400">Showing {filtered.length} of {users.length} users</p>
          </div>
        </div>
      )}

      <ConfirmDialog state={confirm} onClose={() => setConfirm(null)} />
    </DashboardLayout>
  )
}
