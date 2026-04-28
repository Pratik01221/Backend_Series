import { useEffect, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Search, Users } from 'lucide-react'
import { farmerListAPI, traderListAPI } from '../../api/services'

export default function UserSelectModal({ open, onClose, onSelect, role = 'trader' }) {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    const api = role === 'farmer' ? farmerListAPI : traderListAPI
    api.getAll()
      .then(r => setUsers(r.data || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [open, role])

  const filtered = users.filter(u =>
    !search || u.fullName?.toLowerCase().includes(search.toLowerCase())
  )

  const title = role === 'farmer' ? 'Select a Farmer to Chat' : 'Select a Trader to Chat'

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <Dialog.Overlay className="fixed inset-0 bg-black/20" />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-auto p-6 z-10">
        <Dialog.Title className="text-lg font-bold mb-4 flex items-center gap-2">
          <Users size={20} className="text-primary-600" />
          {title}
        </Dialog.Title>
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-8 w-full"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
          {loading ? (
            <div className="space-y-2 py-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-2 py-2 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-2 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-gray-400 py-8 text-sm">No {role}s found</div>
          ) : (
            filtered.map(u => (
              <button
                key={u._id}
                className="w-full text-left px-3 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                onClick={() => { onSelect(u); onClose(); }}
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs flex-shrink-0">
                  {u.fullName?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-gray-900 block truncate">{u.fullName}</span>
                  <span className="text-xs text-gray-500 block truncate">{u.email}</span>
                </div>
              </button>
            ))
          )}
        </div>
        <button className="btn mt-6 w-full" onClick={onClose}>Cancel</button>
      </div>
    </Dialog>
  )
}

