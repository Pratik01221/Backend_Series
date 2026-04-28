import { Link } from 'react-router-dom'

/**
 * EmptyState — a friendly empty/zero-data illustration
 * Props: emoji, title, description, actionLabel, actionTo, onAction
 */
export default function EmptyState({ emoji = '🌾', title, description, actionLabel, actionTo, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="text-6xl mb-5 select-none">{emoji}</div>
      <h3 className="font-display text-xl font-bold text-gray-700 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-6">{description}</p>
      )}
      {actionLabel && (
        actionTo
          ? <Link to={actionTo} className="btn-primary">{actionLabel}</Link>
          : <button onClick={onAction} className="btn-primary">{actionLabel}</button>
      )}
    </div>
  )
}
