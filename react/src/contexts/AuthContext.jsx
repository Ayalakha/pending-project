import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const currentUser = authService.getCurrentUser()
        const isAuth = authService.isAuthenticated()
        
        if (currentUser && isAuth) {
          setUser(currentUser)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        // Clear invalid auth data
        authService.logout()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      
      if (response.status === 'success') {
        setUser(response.user)
        setIsAuthenticated(true)
        return { success: true, user: response.user }
      } else {
        return { success: false, error: response.message || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
      return { success: false, error: errorMessage }
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      console.log('AuthContext: Attempting registration with data:', userData)
      const response = await authService.register(userData)
      console.log('AuthContext: Registration response:', response)
      
      if (response.status === 'success') {
        setUser(response.user)
        setIsAuthenticated(true)
        return { success: true, user: response.user }
      } else {
        return { success: false, error: response.message || 'Registration failed' }
      }
    } catch (error) {
      console.error('AuthContext registration error:', error)
      
      // Handle validation errors specifically
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors
        console.log('Validation errors from API:', validationErrors)
        return { success: false, error: validationErrors }
      }
      
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
      return { success: false, error: errorMessage }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData)
      
      if (response.status === 'success') {
        setUser(response.user)
        return { success: true, user: response.user }
      } else {
        return { success: false, error: response.message || 'Profile update failed' }
      }
    } catch (error) {
      console.error('Profile update error:', error)
      const errorMessage = error.response?.data?.message || 'Profile update failed. Please try again.'
      return { success: false, error: errorMessage }
    }
  }

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role
  }

  // Check if user is owner
  const isOwner = () => hasRole('owner')

  // Check if user is super admin
  const isSuperAdmin = () => hasRole('superAdmin')

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    hasRole,
    isOwner,
    isSuperAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
