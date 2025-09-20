import { useState, useEffect } from 'react'
import { Sweet } from '../types'
import { useAuth } from '../context/AuthContext'
import * as api from '../services/api'
import SweetCard from '../components/SweetCard'
import SearchBar from '../components/SearchBar'

const Home = () => {
  const { user } = useAuth()
  const [allSweets, setAllSweets] = useState<Sweet[]>([])
  const [displayedSweets, setDisplayedSweets] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadSweets()
  }, [])

  const loadSweets = async () => {
    try {
      setLoading(true)
      const data = await api.getSweets(1, 100)
      setAllSweets(data.sweets)
      setDisplayedSweets(data.sweets)
      setError('')
    } catch (err: any) {
      setError('Failed to load sweets')
    } finally {
      setLoading(false)
    }
  }

  const handleFilteredResults = (filteredSweets: Sweet[]) => {
    setDisplayedSweets(filteredSweets)
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

      <SearchBar 
        allSweets={allSweets} 
        onFilteredResults={handleFilteredResults} 
      />

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {displayedSweets?.length === 0 && allSweets?.length > 0 ? (
        <div className="text-center text-gray-500 py-8">
          No sweets found matching your search criteria.
        </div>
      ) : displayedSweets?.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No sweets available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedSweets.map((sweet) => (
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
