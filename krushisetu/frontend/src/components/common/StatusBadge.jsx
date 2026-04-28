export function StatusBadge({ status }) {
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
  }
  return <span className={map[status] || 'badge-gray'}>{status}</span>
}
