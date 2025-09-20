import { useState, useEffect } from 'react'
import { Sweet } from '../types'
import * as api from '../services/api'
import SweetCard from '../components/SweetCard'
import SweetModal from '../components/SweetModal'

const AdminPanel = () => {
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSweet, setEditingSweet] = useState<Sweet | undefined>(undefined)

  useEffect(() => {
    loadSweets()
  }, [])

  const loadSweets = async () => {
    try {
      setLoading(true)
      const data = await api.getSweets(1, 100)
      setSweets(data.sweets)
      setError('')
    } catch (err: any) {
      setError('Failed to load sweets')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSweet = () => {
    setEditingSweet(undefined)
    setModalOpen(true)
  }

  const handleEditSweet = (sweet: Sweet) => {
    setEditingSweet(sweet)
    setModalOpen(true)
  }

  const handleSaveSweet = async (sweetData: any) => {
    try {
      if (editingSweet) {
        await api.updateSweet(editingSweet._id, sweetData)
        setSuccess('Sweet updated successfully!')
      } else {
        await api.addSweet(sweetData)
        setSuccess('Sweet added successfully!')
      }
      setModalOpen(false)
      loadSweets()
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Operation failed')
    }
  }

  const handleDeleteSweet = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) {
      return
    }

    try {
      await api.deleteSweet(id)
      setSuccess('Sweet deleted successfully!')
      loadSweets()
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Delete failed')
    }
  }

  const handleRestockSweet = async (id: string, quantity: number) => {
    try {
      await api.restockSweet(id, quantity)
      setSuccess(`Sweet restocked with ${quantity} units!`)
      loadSweets()
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Restock failed')
    }
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingSweet(undefined)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading admin panel...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
        <button
          onClick={handleAddSweet}
          className="bg-pink-600 text-white px-6 py-3 rounded hover:bg-pink-700 transition"
        >
          Add New Sweet
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-6">
          {success}
        </div>
      )}

      {sweets.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No sweets available. Add some sweets to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sweets.map((sweet) => (
            <SweetCard
              key={sweet._id}
              sweet={sweet}
              onUpdate={loadSweets}
              onEdit={handleEditSweet}
              onDelete={handleDeleteSweet}
            />
          ))}
        </div>
      )}

      <SweetModal
        sweet={editingSweet}
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSaveSweet}
        onRestock={handleRestockSweet}
      />
    </div>
  )
}

export default AdminPanel 
