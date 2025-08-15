import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Users, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Ban,
  UserCheck,
  Crown,
  Building2,
  Loader2,
  AlertCircle,
  Check,
  X
} from 'lucide-react'
import { Navigate } from 'react-router-dom'

// Modal Component
const UserActionModal = ({ isOpen, onClose, user, onRoleChange, onDelete, isUpdating, isDeleting }) => {
  if (!isOpen) return null

  const handleRoleChange = (newRole) => {
    if (window.confirm(`Change ${user.username}'s role to ${newRole}?`)) {
      onRoleChange(newRole)
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete user "${user.username}"? This action cannot be undone.`)) {
      onDelete()
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with light blur */}
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-[2px] transition-opacity" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Actions</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">{user.username}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Change Role</h4>
              <div className="space-y-2">
                {['user', 'owner', 'superAdmin'].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    disabled={user.role === role || isUpdating}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      user.role === role
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {role === 'superAdmin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1)}
                    {user.role === role && ' (Current)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Delete Section */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Danger Zone</h4>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full flex items-center justify-center px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const UserRow = ({ user, onOpenModal }) => {
  const getRoleBadge = (role) => {
    const badges = {
      superAdmin: { color: 'bg-red-100 text-red-800', icon: Crown, label: 'Super Admin' },
      owner: { color: 'bg-blue-100 text-blue-800', icon: Building2, label: 'Owner' },
      user: { color: 'bg-green-100 text-green-800', icon: UserCheck, label: 'User' }
    }
    const badge = badges[role] || badges.user
    const IconComponent = badge.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {badge.label}
      </span>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.username}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getRoleBadge(user.role)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(user.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Check className="w-3 h-3 mr-1" />
          Active
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onOpenModal(user)}
          className="inline-flex items-center justify-center p-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </td>
    </tr>
  )
}

const UserManagementPage = () => {
  const { user, isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()

  // Check admin permissions
  if (!isAuthenticated || user?.role !== 'superAdmin') {
    return <Navigate to="/login" replace />
  }

  // Mutations for user actions
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => adminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers'])
      setIsModalOpen(false)
      setSelectedUser(null)
    }
  })

  const deleteUserMutation = useMutation({
    mutationFn: (userId) => adminService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers'])
      setIsModalOpen(false)
      setSelectedUser(null)
    }
  })

  // Fetch users
  const { data: usersData, isLoading, error, refetch } = useQuery({
    queryKey: ['adminUsers', searchTerm, roleFilter],
    queryFn: () => adminService.getAllUsers({
      search: searchTerm,
      role: roleFilter
    }),
    keepPreviousData: true,
  })

  const users = usersData?.users || []
  
  // Count total super admins
  const totalSuperAdmins = users.filter(u => u.role === 'superAdmin').length

  const handleRefresh = () => {
    refetch()
  }

  const handleOpenModal = (userData) => {
    setSelectedUser(userData)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const handleRoleChange = (newRole) => {
    if (!selectedUser) return
    
    // Prevent demoting the last superAdmin
    if (selectedUser.role === 'superAdmin' && newRole !== 'superAdmin' && totalSuperAdmins <= 1) {
      alert('Cannot demote the last super admin. At least one super admin must exist.')
      return
    }
    
    updateRoleMutation.mutate({ userId: selectedUser.id, role: newRole })
  }

  const handleDelete = () => {
    if (!selectedUser) return
    
    // Prevent deleting the last superAdmin
    if (selectedUser.role === 'superAdmin' && totalSuperAdmins <= 1) {
      alert('Cannot delete the last super admin. At least one super admin must exist.')
      return
    }
    
    deleteUserMutation.mutate(selectedUser.id)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading users...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-red-800 mb-2">Error Loading Users</h2>
            <p className="text-red-600">Failed to load user data. Please try again later.</p>
            <button onClick={handleRefresh} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">
            Manage user accounts, roles, and permissions across the platform
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">All Roles</option>
                  <option value="user">Users</option>
                  <option value="owner">Owners</option>
                  <option value="superAdmin">Super Admins</option>
                </select>
              </div>
              
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Users ({users.length})
            </h2>
          </div>
          
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 relative">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((userData) => (
                    <UserRow 
                      key={userData.id} 
                      user={userData} 
                      onOpenModal={handleOpenModal}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
              <p className="text-gray-600">
                {searchTerm || roleFilter 
                  ? 'No users match your current filters.' 
                  : 'No users found in the system.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Rendered outside table structure */}
      {selectedUser && (
        <UserActionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          user={selectedUser}
          onRoleChange={handleRoleChange}
          onDelete={handleDelete}
          isUpdating={updateRoleMutation.isLoading}
          isDeleting={deleteUserMutation.isLoading}
        />
      )}
    </div>
  )
}

export default UserManagementPage
