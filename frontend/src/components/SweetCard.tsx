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
      chocolate: 'bg-amber-100 text-amber-800',
      candy: 'bg-pink-100 text-pink-800',
      gummy: 'bg-green-100 text-green-800',
      'hard candy': 'bg-red-100 text-red-800',
      lollipop: 'bg-purple-100 text-purple-800',
      toffee: 'bg-yellow-100 text-yellow-800',
      marshmallow: 'bg-blue-100 text-blue-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[category] || colors.other
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{sweet.name}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(sweet.category)}`}>
          {sweet.category}
        </span>
      </div>
      
      {sweet.description && (
        <p className="text-gray-600 mb-4">{sweet.description}</p>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-bold text-green-600">${sweet.price.toFixed(2)}</span>
        <span className="text-gray-500">Stock: {sweet.quantity}</span>
      </div>
      
      {message && (
        <div className={`mb-4 p-2 rounded text-sm ${
          message.includes('successful') 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}
      
      {user && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max={sweet.quantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 px-2 py-1 border border-gray-300 rounded"
            />
            <button
              onClick={handlePurchase}
              disabled={sweet.quantity === 0 || loading}
              className="flex-1 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Purchasing...' : 'Purchase'}
            </button>
          </div>
          
          {user.role === 'admin' && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit && onEdit(sweet)}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete && onDelete(sweet._id)}
                className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SweetCard