import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // A 401 from the login attempt itself just means "wrong credentials" -
      // let LoginPage show that error instead of wiping the (already empty) session.
      const isLoginAttempt = error.config?.url?.includes('/auth/login')

      if (!isLoginAttempt) {
        // Any other 401 means the session/token is stale or invalid - log the user out.
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
