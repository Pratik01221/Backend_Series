import { useEffect, useState } from 'react'
import { Search, User, X } from 'lucide-react'
import { traderListAPI } from '../../api/services'
import toast from 'react-hot-toast'

export default function TraderSelectModal({ open, onClose, onSelect }) {
  const [traders, setTraders] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError(null)
    traderListAPI.getAll()
      .then(r => {
        console.log('Traders loaded:', r.data?.length)
        setTraders(r.data || [])
      })
      .catch(err => {
        console.error('Failed to load traders:', err)
        setError(err.message)
        toast.error('Failed to load traders')
      })
      .finally(() => setLoading(false))
  }, [open])

  const filtered = traders.filter(t =>
    !search || t.fullName?.toLowerCase().includes(search.toLowerCase())
  )

  if (!open) return null

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/30" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 z-10 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-lg font-bold mb-4 pr-8">Select a Trader to Chat</h2>
        
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9 w-full text-sm"
            placeholder="Search traders…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        
        <div className="max-h-64 overflow-y-auto divide-y -mx-2">
          {loading ? (
            <div className="text-center text-gray-400 py-8">
              <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Loading traders…
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              <p className="text-sm">{error}</p>
              <button 
                onClick={() => {
                  setError(null)
                  setLoading(true)
                  traderListAPI.getAll()
                    .then(r => setTraders(r.data || []))
                    .catch(err => setError(err.message))
                    .finally(() => setLoading(false))
                }}
                className="text-sm text-primary-600 hover:underline mt-2"
              >
                Try again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <User size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">{search ? 'No traders found' : 'No traders available'}</p>
            </div>
          ) : filtered.map(trader => (
            <button
              key={trader._id}
              className="w-full text-left px-3 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors"
              onClick={() => { 
                onSelect(trader); 
                onClose(); 
              }}
            >
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                {trader.fullName?.charAt(0).toUpperCase() || 'T'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{trader.fullName}</p>
                <p className="text-xs text-gray-500 truncate">{trader.email}</p>
              </div>
            </button>
          ))}
        </div>
        
        <button 
          className="btn mt-4 w-full" 
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
