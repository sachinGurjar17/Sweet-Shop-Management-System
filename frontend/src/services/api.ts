import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const register = async (name: string, email: string, password: string, role?: string) => {
  const response = await api.post('/auth/register', { name, email, password, role })
  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

export const getSweets = async (page = 1, limit = 10) => {
  const response = await api.get(`/sweets?page=${page}&limit=${limit}`)
  return response.data
}

export const searchSweets = async (filters: any) => {
  const params = new URLSearchParams()
  Object.keys(filters).forEach(key => {
    if (filters[key]) params.append(key, filters[key])
  })
  const response = await api.get(`/sweets/search?${params}`)
  return response.data
}

export const addSweet = async (sweetData: any) => {
  const response = await api.post('/sweets', sweetData)
  return response.data
}

export const updateSweet = async (id: string, sweetData: any) => {
  const response = await api.put(`/sweets/${id}`, sweetData)
  return response.data
}

export const deleteSweet = async (id: string) => {
  const response = await api.delete(`/sweets/${id}`)
  return response.data
}

export const purchaseSweet = async (id: string, quantity: number) => {
  const response = await api.post(`/sweets/${id}/purchase`, { quantity })
  return response.data
}

export const restockSweet = async (id: string, quantity: number) => {
  const response = await api.post(`/sweets/${id}/restock`, { quantity })
  return response.data
}