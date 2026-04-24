import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`)
}

// Messages API
export const messagesAPI = {
  getAll: () => api.get('/messages'),
  getOne: (id) => api.get(`/messages/${id}`),
  create: (data) => api.post('/messages', data),
  markAsRead: (id) => api.put(`/messages/${id}/read`),
  delete: (id) => api.delete(`/messages/${id}`)
}

// Profile API
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data)
}

// Visitors API
export const visitorsAPI = {
  track: (data) => api.post('/visitors/track', data),
  getStats: () => api.get('/visitors/stats')
}

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  verifyToken: () => api.get('/auth/verify')
}

// Stats API
export const fetchStats = async () => {
  try {
    const [projects, messages, visitors] = await Promise.all([
      api.get('/projects'),
      api.get('/messages'),
      api.get('/visitors/stats')
    ])

    return {
      totalProjects: projects.data.data?.length || 0,
      totalMessages: messages.data.data?.length || 0,
      unreadMessages: messages.data.data?.filter(m => !m.read).length || 0,
      totalVisitors: visitors.data.total || 0,
      todayVisitors: visitors.data.today || 0
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return {
      totalProjects: 0,
      totalMessages: 0,
      unreadMessages: 0,
      totalVisitors: 0,
      todayVisitors: 0
    }
  }
}

export default api
