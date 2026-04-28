/**
 * ConfirmDialog — replaces window.confirm() with a styled modal
 * Usage:
 *   const [confirmState, setConfirmState] = useState(null)
 *   setConfirmState({ message: 'Delete this crop?', onConfirm: () => doDelete() })
 *   <ConfirmDialog state={confirmState} onClose={() => setConfirmState(null)} />
 */
export default function ConfirmDialog({ state, onClose }) {
  if (!state) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-4xl text-center mb-4">{state.icon || '⚠️'}</div>
        <h3 className="font-display text-xl font-bold text-gray-900 text-center mb-2">
          {state.title || 'Are you sure?'}
        </h3>
        <p className="text-gray-500 text-sm text-center mb-6 leading-relaxed">
          {state.message || 'This action cannot be undone.'}
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={() => { state.onConfirm?.(); onClose() }}
            className={`flex-1 font-medium px-5 py-2.5 rounded-xl transition-all ${
              state.danger
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            {state.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
