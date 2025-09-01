import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import { User, Mail, Calendar, Shield, Edit3, Lock, Phone, FileText, Save, X, Eye, EyeOff } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

const ProfilePage = () => {
  const { user, isAuthenticated, updateProfile: updateUserContext } = useAuth()
  
  console.log('ProfilePage rendering with user:', user)
  console.log('ProfilePage user username:', user?.username)
  
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  })

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  // Sync form data with user changes
  useEffect(() => {
    console.log('User data changed:', user)
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || ''
      })
    }
  }, [user])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'superAdmin':
        return 'bg-red-100 text-red-800'
      case 'owner':
        return 'bg-blue-100 text-blue-800'
      case 'user':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'superAdmin':
        return 'Super Administrator'
      case 'owner':
        return 'Business Owner'
      case 'user':
        return 'User'
      default:
        return role
    }
  }

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => authService.updateProfile(data),
    onSuccess: async (response) => {
      console.log('Profile update response:', response)
      console.log('Old user data:', user)
      console.log('New user data:', response.user)
      
      // Update localStorage immediately to ensure persistence
      localStorage.setItem('user', JSON.stringify(response.user))
      
      // Update context
      updateUserContext(response.user)
      
      // Update the form state with the new user data
      setProfileForm({
        first_name: response.user.first_name || '',
        last_name: response.user.last_name || '',
        email: response.user.email || '',
        phone: response.user.phone || '',
        bio: response.user.bio || ''
      })
      
      setSuccessMessage('Profile updated successfully!')
      setIsEditingProfile(false)
      setErrors({})
      setLastUpdate(Date.now()) // Force re-render
      
      // Force a re-fetch of user data to ensure consistency
      try {
        const freshUserData = await authService.getProfile()
        if (freshUserData.status === 'success') {
          console.log('Fresh user data from server:', freshUserData.user)
          updateUserContext(freshUserData.user)
        }
      } catch (error) {
        console.error('Failed to fetch fresh user data:', error)
      }
      
      setTimeout(() => setSuccessMessage(''), 3000)
    },
    onError: (error) => {
      console.error('Profile update error:', error)
      setErrors(error.response?.data?.errors || { general: 'Failed to update profile' })
    }
  })

  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data) => authService.changePassword(data),
    onSuccess: () => {
      setSuccessMessage('Password changed successfully!')
      setIsChangingPassword(false)
      setPasswordForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      })
      setErrors({})
      setTimeout(() => setSuccessMessage(''), 3000)
    },
    onError: (error) => {
      setErrors(error.response?.data?.errors || { general: 'Failed to change password' })
    }
  })

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    updateProfileMutation.mutate(profileForm)
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    changePasswordMutation.mutate(passwordForm)
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const getFullName = () => {
    const firstName = user?.first_name || ''
    const lastName = user?.last_name || ''
    const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : ''
    return fullName || 'User'
  }

  // Profile Display Component
  const ProfileDisplay = ({ userData }) => {
    console.log('ProfileDisplay rendering with userData:', userData)
    console.log('ProfileDisplay userData first_name:', userData?.first_name)
    console.log('ProfileDisplay userData last_name:', userData?.last_name)
    
    const displayName = () => {
      // Use first_name and last_name for display
      const firstName = userData?.first_name || ''
      const lastName = userData?.last_name || ''
      const fullName = `${firstName} ${lastName}`.trim()
      console.log('ProfileDisplay displayName calculated:', fullName)
      return fullName || 'User'
    }
    
    const getFirstName = () => userData?.first_name || ''
    const getLastName = () => userData?.last_name || ''

    return (
      <div>
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{displayName()}</h2>
            {getFullName() && (
              <p className="text-lg text-gray-700">{getFullName()}</p>
            )}
            <p className="text-gray-600">{userData?.email}</p>
            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-2 ${getRoleBadgeColor(userData?.role)}`}>
              {getRoleDisplayName(userData?.role)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">First Name</p>
                <p className="text-gray-900">{getFirstName()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Last Name</p>
                <p className="text-gray-900">{getLastName()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Email Address</p>
                <p className="text-gray-900">{userData?.email}</p>
              </div>
            </div>

            {userData?.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone Number</p>
                  <p className="text-gray-900">{userData.phone}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Account Type</p>
                <p className="text-gray-900">{getRoleDisplayName(userData?.role)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Member Since</p>
                <p className="text-gray-900">
                  {userData?.created_at ? formatDate(userData.created_at) : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {userData?.bio && (
            <div className="md:col-span-2">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Bio</p>
                  <p className="text-gray-900 mt-1">{userData.bio}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600 font-medium">{successMessage}</p>
          </div>
        )}

        {/* General Errors */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 font-medium">{errors.general}</p>
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>

          {isEditingProfile ? (
            /* Edit Profile Form */
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={profileForm.first_name}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                  {errors.first_name && (
                    <p className="text-red-600 text-sm mt-1">{errors.first_name[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={profileForm.last_name}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                  {errors.last_name && (
                    <p className="text-red-600 text-sm mt-1">{errors.last_name[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={profileForm.last_name}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {errors.last_name && (
                    <p className="text-red-600 text-sm mt-1">{errors.last_name[0]}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone[0]}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  {errors.bio && (
                    <p className="text-red-600 text-sm mt-1">{errors.bio[0]}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingProfile(false)
                    setErrors({})
                    // Reset form to current user data
                    setProfileForm({
                      username: user?.username || '',
                      email: user?.email || '',
                      first_name: user?.first_name || '',
                      last_name: user?.last_name || '',
                      phone: user?.phone || '',
                      bio: user?.bio || ''
                    })
                  }}
                  className="flex items-center px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Display Profile Information */
            <ProfileDisplay userData={user} key={`profile-${user?.id}-${user?.first_name}-${user?.last_name}-${lastUpdate}`} />
          )}
        </div>

        {/* Password Change Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Security Settings</h3>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </button>
            )}
          </div>

          {isChangingPassword ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.current ? 'text' : 'password'}
                      name="current_password"
                      value={passwordForm.current_password}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.current_password && (
                    <p className="text-red-600 text-sm mt-1">{errors.current_password[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 ">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? 'text' : 'password'}
                      name="new_password"
                      value={passwordForm.new_password}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 bg-white hover:text-gray-600"
                    >
                      {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.new_password && (
                    <p className="text-red-600 text-sm mt-1">{errors.new_password[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? 'text' : 'password'}
                      name="new_password_confirmation"
                      value={passwordForm.new_password_confirmation}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 bg-white hover:text-gray-600"
                    >
                      {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false)
                    setPasswordForm({
                      current_password: '',
                      new_password: '',
                      new_password_confirmation: ''
                    })
                    setErrors({})
                  }}
                  className="flex items-center px-6 py-2 bg-gray-600  text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="text-gray-600">
              <p>Password was last changed on {user?.updated_at ? formatDate(user.updated_at) : 'Unknown date'}.</p>
              <p className="text-sm mt-2">For security reasons, we recommend changing your password regularly.</p>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
          <h3 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h3>
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-red-600 mb-2">Delete Account</h4>
            <p className="text-sm text-red-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => alert('Account deletion is not yet implemented')}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
