import { useState } from 'react'
import { Sweet } from '../types'
import { useAuth } from '../context/AuthContext'
import * as api from '../services/api'

interface SweetCardProps {
  sweet: Sweet
  onUpdate: () => void
  onEdit?: (sweet: Sweet) => void
  onDelete?: (id: string) => void
}

const SweetCard = ({ sweet, onUpdate, onEdit, onDelete }: SweetCardProps) => {
  const { user } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handlePurchase = async () => {
    if (!user) return
    setLoading(true)
    setMessage('')
    try {
      await api.purchaseSweet(sweet._id, quantity)
      setMessage('Purchase successful!')
      onUpdate()
      setQuantity(1)
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Purchase failed')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      chocolate: 'from-amber-200 via-amber-100 to-amber-50 text-amber-800',
      candy: 'from-pink-200 via-pink-100 to-pink-50 text-pink-800',
      gummy: 'from-green-200 via-green-100 to-green-50 text-green-800',
      'hard candy': 'from-red-200 via-red-100 to-red-50 text-red-800',
      lollipop: 'from-purple-200 via-purple-100 to-purple-50 text-purple-800',
      toffee: 'from-yellow-200 via-yellow-100 to-yellow-50 text-yellow-800',
      marshmallow: 'from-blue-200 via-blue-100 to-blue-50 text-blue-800',
      other: 'from-gray-200 via-gray-100 to-gray-50 text-gray-800'
    }
    return colors[category] || colors.other
  }
  

  return (
    <div
      className="rounded-2xl bg-white border border-gray-200 shadow transition-all hover:shadow-xl hover:-translate-y-1 duration-200 relative overflow-hidden group"
    >
      <div className="h-40 bg-gradient-to-bl from-pink-100 via-pink-50 to-white flex items-center justify-center">
        {sweet.imageUrl ? (
          <img
            src={sweet.imageUrl}
            alt={sweet.name}
            className="object-contain h-32 max-w-full"
            loading="lazy"
          />
        ) : (
          <span className="text-5xl text-gray-200">🍬</span>
        )}
        {user && user.role === 'admin' && (
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              type="button"
              onClick={() => onEdit && onEdit(sweet)}
              className="bg-blue-500/80 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-xs shadow"
              aria-label="Edit"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete && onDelete(sweet._id)}
              className="bg-red-500/80 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs shadow"
              aria-label="Delete"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="px-6 py-5">
        {/* Name + Category */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 truncate">{sweet.name}</h3>
          <span
            className={`px-3 py-1 ml-2 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(sweet.category)} shadow-sm`}
          >
            {sweet.category}
          </span>
        </div>

        {sweet.description && (
          <p className="text-sm text-gray-500 my-2 min-h-[2rem]">{sweet.description}</p>
        )}

        <div className="flex items-end justify-between mt-4 mb-2">
          <span className="text-2xl font-bold text-emerald-600">${sweet.price.toFixed(2)}</span>
          <span className="text-sm text-gray-400">Stock: {sweet.quantity}</span>
        </div>

        {message && (
          <div
            className={`mb-3 px-3 py-2 rounded-md text-xs font-medium shadow transition-opacity duration-300 ${
              message.includes('successful')
                ? 'bg-green-100/80 text-green-800'
                : 'bg-red-100/80 text-red-800'
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        {user && user.role=='user' && (
          <div className="mt-2 space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max={sweet.quantity}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                disabled={sweet.quantity === 0}
                className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 disabled:bg-gray-50 transition"
              />
              <button
                onClick={handlePurchase}
                disabled={sweet.quantity === 0 || loading}
                className={`flex-1 px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 hover:from-pink-600 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-300 transition
                disabled:from-gray-300 disabled:via-gray-400 disabled:to-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed`}
              >
                {loading ? 'Purchasing...' : 'Buy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SweetCard
