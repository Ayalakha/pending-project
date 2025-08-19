import api from './api'

export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    
    if (response.data.status === 'success') {
      // Store token and user data
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // Set default authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
    }
    
    return response.data
  },

  // Register user
  register: async (userData) => {
    try {
      // Remove password_confirmation from the request as Laravel doesn't expect it
      const { password_confirmation, ...registerData } = userData
      console.log('Sending registration data:', registerData)
      
      const response = await api.post('/auth/register', registerData)
      console.log('Registration response:', response.data)
      
      if (response.data.status === 'success') {
        // Store token and user data
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // Set default authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      }
      
      return response.data
    } catch (error) {
      console.error('Registration error:', error)
      console.error('Error response:', error.response?.data)
      throw error
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error)
    } finally {
      // Clear local storage and authorization header
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      delete api.defaults.headers.common['Authorization']
    }
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // Get current token from localStorage
  getToken: () => {
    return localStorage.getItem('auth_token')
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('auth_token')
    const user = localStorage.getItem('user')
    return !!(token && user)
  },

  // Validate token with server
  validateToken: async () => {
    try {
      const response = await api.get('/auth/me')
      if (response.data.status === 'success') {
        // Update user data in case it changed
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return { valid: true, user: response.data.user }
      }
    } catch (error) {
      // Token is invalid
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      return { valid: false }
    }
    return { valid: false }
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData)
    
    if (response.data.status === 'success') {
      // Update user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    const response = await api.post('/auth/password/reset', { email })
    return response.data
  },

  // Reset password with token
  resetPassword: async (resetData) => {
    const response = await api.post('/auth/password/reset/confirm', resetData)
    return response.data
  }
}

// Initialize auth on app load
const initializeAuth = () => {
  const token = authService.getToken()
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

// Call initialize on module load
initializeAuth()
