import { useState } from 'react'
import { X, CreditCard, Smartphone, Building2, Banknote } from 'lucide-react'
import { paymentAPI } from '../../api/services'
import toast from 'react-hot-toast'

const methods = [
  { id: 'razorpay', label: 'Razorpay / UPI', icon: <Smartphone size={18} />, desc: 'Pay via UPI, cards, netbanking' },
  { id: 'upi',      label: 'Direct UPI',    icon: <Smartphone size={18} />, desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: <Building2 size={18} />, desc: 'NEFT / RTGS / IMPS' },
  { id: 'cash',     label: 'Cash on Delivery', icon: <Banknote size={18} />, desc: 'Pay on receipt of goods' },
]

export default function PaymentModal({ order, onClose, onSuccess }) {
  const [method, setMethod] = useState('razorpay')
  const [transactionId, setTransactionId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handlePay = async () => {
    setSubmitting(true)
    try {
      await paymentAPI.create({ orderId: order._id, method, transactionId: transactionId || `TXN-${Date.now()}` })
      toast.success('Payment recorded successfully!')
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center">
              <CreditCard size={18} className="text-primary-600" />
            </div>
            <h3 className="font-display text-xl font-bold text-gray-900">Make Payment</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Order summary */}
          <div className="bg-primary-50 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Order</span>
              <span className="font-medium">{order.cropId?.cropName}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Quantity</span>
              <span className="font-medium">{order.quantity} kg</span>
            </div>
            <div className="flex justify-between font-bold text-primary-700 pt-2 border-t border-primary-100 mt-2">
              <span>Total Amount</span>
              <span>₹{order.totalPrice?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Payment method */}
          <div>
            <p className="label mb-2">Select Payment Method</p>
            <div className="space-y-2">
              {methods.map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                    method === m.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <div className={`flex-shrink-0 ${method === m.id ? 'text-primary-600' : 'text-gray-400'}`}>{m.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${method === m.id ? 'text-primary-700' : 'text-gray-700'}`}>{m.label}</p>
                    <p className="text-xs text-gray-400">{m.desc}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${method === m.id ? 'border-primary-500 bg-primary-500' : 'border-gray-300'}`}>
                    {method === m.id && <div className="w-full h-full rounded-full bg-white scale-50" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Transaction ID (optional) */}
          {method !== 'cash' && (
            <div>
              <label className="label">Transaction ID <span className="text-gray-400 font-normal">(optional)</span></label>
              <input className="input" placeholder="e.g. UPI ref / NEFT UTR number"
                value={transactionId} onChange={e => setTransactionId(e.target.value)} />
            </div>
          )}

          <button onClick={handlePay} disabled={submitting} className="btn-primary w-full py-3 text-base">
            {submitting ? 'Processing...' : `Pay ₹${order.totalPrice?.toLocaleString('en-IN')}`}
          </button>

          <p className="text-center text-xs text-gray-400">
            By clicking Pay you confirm the payment has been or will be made to the farmer.
          </p>
        </div>
      </div>
    </div>
  )
}
