// Reusable skeleton loading components

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="bg-white rounded-2xl p-5 animate-pulse flex gap-4 items-center">
      <div className="w-14 h-14 bg-gray-200 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
      <div className="h-6 bg-gray-200 rounded-full w-20" />
    </div>
  )
}

export function SkeletonStat() {
  return (
    <div className="bg-white rounded-2xl p-5 animate-pulse flex gap-4 items-center">
      <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0" />
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-16" />
        <div className="h-3 bg-gray-200 rounded w-24" />
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card">
      <div className="h-10 bg-gray-100 border-b border-gray-200 animate-pulse" />
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3 border-b border-gray-100 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/6" />
          <div className="h-4 bg-gray-200 rounded w-1/6" />
          <div className="h-4 bg-gray-200 rounded w-1/6" />
        </div>
      ))}
    </div>
  )
}
