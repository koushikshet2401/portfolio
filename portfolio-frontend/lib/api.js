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
  // If sending FormData, delete Content-Type so browser sets boundary correctly
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
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
  trackEngagement: (data) => api.post('/visitors/engagement', data),
  getStats: () => api.get('/visitors/stats'),
  getAll: () => api.get('/visitors')
}

// Internships API
export const internshipsAPI = {
  getAll: () => api.get('/internships'),
  getOne: (id) => api.get(`/internships/${id}`),
  create: (data) => api.post('/internships', data),
  update: (id, data) => api.put(`/internships/${id}`, data),
  delete: (id) => api.delete(`/internships/${id}`)
}

// Certificates API
export const certificatesAPI = {
  getAll: () => api.get('/certificates'),
  getOne: (id) => api.get(`/certificates/${id}`),
  create: (data) => api.post('/certificates', data),
  update: (id, data) => api.put(`/certificates/${id}`, data),
  delete: (id) => api.delete(`/certificates/${id}`)
}

// Dashboard Stats API
export const dashboardAPI = {
  getStats: (range = '14d') => api.get(`/dashboard/stats?range=${range}`)
}

// Upload API
export const uploadAPI = {
  uploadFile: async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null

    // Native fetch guarantees the browser generates multipart/form-data with the correct boundary
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    })

    const result = await response.json()
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'File upload failed')
    }
    return {
      data: result,
      success: result.success,
      url: result.url || result.data?.url,
      fullUrl: result.fullUrl || result.data?.fullUrl
    }
  }
}

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  verifyToken: () => api.get('/auth/verify')
}

// Unified Stats Fetcher (hits /dashboard/stats with date range support)
export const fetchStats = async (range = '14d') => {
  try {
    const res = await dashboardAPI.getStats(range)
    if (res.data && res.data.data) {
      return res.data.data
    }
  } catch (error) {
    // Graceful fallback to individual endpoints
  }

  // Graceful fallback: individual parallel requests
  try {
    const [projectsRes, internshipsRes, certsRes, messagesRes, visitorsRes] = await Promise.all([
      api.get('/projects').catch(() => ({ data: { data: [] } })),
      api.get('/internships').catch(() => ({ data: { data: [] } })),
      api.get('/certificates').catch(() => ({ data: { data: [] } })),
      api.get('/messages').catch(() => ({ data: { data: [] } })),
      api.get('/visitors/stats').catch(() => ({ data: { total: 0, today: 0 } }))
    ])

    const projects = projectsRes.data?.data || []
    const internships = internshipsRes.data?.data || []
    const certificates = certsRes.data?.data || []
    const messages = messagesRes.data?.data || []
    const visitors = visitorsRes.data || {}

    return {
      visitors: {
        totalUnique: visitors.total || 0,
        todayUnique: visitors.today || 0,
        todayNew: visitors.today || 0,
        todayReturning: 0,
        totalViews: visitors.totalPageViews || visitors.total || 0,
        dailyTraffic: [],
        topPages: [],
        recentVisitors: []
      },
      projects: {
        total: projects.length,
        featured: projects.filter((p) => p.featured).length
      },
      internships: {
        total: internships.length
      },
      certificates: {
        total: certificates.length
      },
      feedback: {
        total: messages.length,
        unread: messages.filter((m) => !m.read).length,
        recent: messages.slice(0, 5)
      }
    }
  } catch (err) {
    console.error('Failed to load portfolio stats:', err)
    return {
      visitors: {
        totalUnique: 0,
        todayUnique: 0,
        todayNew: 0,
        todayReturning: 0,
        totalViews: 0,
        dailyTraffic: [],
        topPages: [],
        recentVisitors: []
      },
      projects: { total: 0, featured: 0 },
      internships: { total: 0 },
      certificates: { total: 0 },
      feedback: { total: 0, unread: 0, recent: [] }
    }
  }
}

export default api
