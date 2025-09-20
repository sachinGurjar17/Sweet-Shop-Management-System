import { useState } from 'react'
import { SearchFilters, Sweet } from '../types'

interface SearchBarProps {
  allSweets: Sweet[]
  onFilteredResults: (filteredSweets: Sweet[]) => void
}

const SearchBar = ({ allSweets, onFilteredResults }: SearchBarProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  })

  const categories = [
    'chocolate', 'candy', 'gummy', 'hard candy', 
    'lollipop', 'toffee', 'marshmallow', 'other'
  ]

  const filterSweets = (currentFilters: SearchFilters) => {
    let filtered = [...allSweets]

    if (currentFilters.name.trim()) {
      const searchTerm = currentFilters.name.toLowerCase()
      filtered = filtered.filter(sweet => 
        sweet.name.toLowerCase().includes(searchTerm) ||
        (sweet.description && sweet.description.toLowerCase().includes(searchTerm))
      )
    }

    if (currentFilters.category) {
      filtered = filtered.filter(sweet => sweet.category === currentFilters.category)
    }

    if (currentFilters.minPrice) {
      const minPrice = parseFloat(currentFilters.minPrice)
      filtered = filtered.filter(sweet => sweet.price >= minPrice)
    }

    if (currentFilters.maxPrice) {
      const maxPrice = parseFloat(currentFilters.maxPrice)
      filtered = filtered.filter(sweet => sweet.price <= maxPrice)
    }

    onFilteredResults(filtered)
  }

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    filterSweets(newFilters)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    filterSweets(filters)
  }

  const handleClear = () => {
    const emptyFilters = { name: '', category: '', minPrice: '', maxPrice: '' }
    setFilters(emptyFilters)
    onFilteredResults(allSweets)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Name
          </label>
          <input
            type="text"
            placeholder="Sweet name..."
            value={filters.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={filters.minPrice}
            onChange={(e) => handleInputChange('minPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="100.00"
            value={filters.maxPrice}
            onChange={(e) => handleInputChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
        >
          Clear Filters
        </button>
      </div>
    </form>
  )
}

export default SearchBar
