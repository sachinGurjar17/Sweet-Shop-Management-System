import { useState, useEffect } from 'react'
import { Sweet, SearchFilters } from '../types'
import { useAuth } from '../context/AuthContext'
import * as api from '../services/api'
import SweetCard from '../components/SweetCard'
import SearchBar from '../components/SearchBar'

const Home = () => {
  const { user } = useAuth()
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    loadSweets()
  }, [])

  const loadSweets = async () => {
    try {
      setLoading(true)
      const data = await api.getSweets(1, 50)
      setSweets(data.sweets)
      setError('')
    } catch (err: any) {
      setError('Failed to load sweets')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (filters: SearchFilters) => {
    const hasFilters = filters.name || filters.category || filters.minPrice || filters.maxPrice
    
    if (!hasFilters) {
      setIsSearching(false)
      loadSweets()
      return
    }

    try {
      setIsSearching(true)
      setLoading(true)
      const data = await api.searchSweets(filters)
      setSweets(data.sweets)
      setError('')
    } catch (err: any) {
      setError('Search failed')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading sweets...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Sweet Shop</h1>
        <p className="text-gray-600 text-lg">
          Discover delicious sweets and satisfy your sweet tooth!
        </p>
        {!user && (
          <p className="text-pink-600 mt-2">
            Please login to purchase sweets
          </p>
        )}
      </div>

      <SearchBar onSearch={handleSearch} />

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {sweets.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {isSearching ? 'No sweets found matching your search criteria.' : 'No sweets available at the moment.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sweets.map((sweet) => (
            <SweetCard
              key={sweet._id}
              sweet={sweet}
              onUpdate={loadSweets}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home