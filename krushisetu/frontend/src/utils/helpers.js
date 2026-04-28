/**
 * KrushiSetu — Utility helpers
 */

// Format Indian currency
export const formatINR = (amount) => {
  if (amount == null) return '₹0'
  return `₹${Number(amount).toLocaleString('en-IN')}`
}

// Format date in Indian style
export const formatDate = (date, opts = {}) => {
  if (!date) return '—'
  const defaults = { day: 'numeric', month: 'short', year: 'numeric' }
  return new Date(date).toLocaleDateString('en-IN', { ...defaults, ...opts })
}

// Format date + time
export const formatDateTime = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// Relative time (e.g. "2 hours ago")
export const timeAgo = (date) => {
  if (!date) return ''
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000)
  const intervals = [
    { label: 'year',   secs: 31536000 },
    { label: 'month',  secs: 2592000  },
    { label: 'week',   secs: 604800   },
    { label: 'day',    secs: 86400    },
    { label: 'hour',   secs: 3600     },
    { label: 'minute', secs: 60       },
  ]
  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs)
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Truncate long text
export const truncate = (str, max = 60) => {
  if (!str) return ''
  return str.length > max ? str.slice(0, max) + '…' : str
}

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

// Generate chat room ID (deterministic, sorted)
export const getRoomId = (id1, id2) => [id1, id2].sort().join('_')

// Validate Indian phone number
export const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone)

// Validate email
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// Get status color class
export const getStatusColor = (status) => {
  const map = {
    pending:   'badge-yellow',
    confirmed: 'badge-blue',
    shipped:   'badge-blue',
    delivered: 'badge-green',
    cancelled: 'badge-red',
    available: 'badge-green',
    sold:      'badge-gray',
    reserved:  'badge-yellow',
    accepted:  'badge-green',
    rejected:  'badge-red',
    converted: 'badge-blue',
    completed: 'badge-green',
    failed:    'badge-red',
    active:    'badge-green',
    inactive:  'badge-red',
  }
  return map[status] || 'badge-gray'
}

// Crop category emoji map
export const categoryEmoji = {
  vegetables: '🥬',
  fruits:     '🍎',
  grains:     '🌾',
  pulses:     '🫘',
  spices:     '🌶️',
  oilseeds:   '🌻',
  others:     '🌱',
}

// Paginate array locally
export const paginate = (arr, page, limit) =>
  arr.slice((page - 1) * limit, page * limit)
