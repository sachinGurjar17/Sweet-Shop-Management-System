export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
}

export interface Sweet {
  _id: string
  name: string
  category: string
  price: number
  quantity: number
  description?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role?: string) => Promise<void>
  logout: () => void
  loading: boolean
}

export interface SearchFilters {
  name: string
  category: string
  minPrice: string
  maxPrice: string
}