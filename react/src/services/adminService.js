import api from './api'

export const adminService = {
  // User Management
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params })
    return response.data
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`)
    return response.data
  },

  updateUser: async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data)
    return response.data
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data
  },

  updateUserRole: async (id, role) => {
    const response = await api.put(`/admin/users/${id}/role`, { role })
    return response.data
  },

  banUser: async (id) => {
    const response = await api.put(`/admin/users/${id}/ban`)
    return response.data
  },

  unbanUser: async (id) => {
    const response = await api.put(`/admin/users/${id}/unban`)
    return response.data
  },

  // Company Management
  getAllCompanies: async (params = {}) => {
    const response = await api.get('/admin/companies', { params })
    return response.data
  },

  approveCompany: async (id) => {
    const response = await api.put(`/admin/companies/${id}/approve`)
    return response.data
  },

  rejectCompany: async (id, reason) => {
    const response = await api.put(`/admin/companies/${id}/reject`, { reason })
    return response.data
  },

  // Content Management
  getAllBlogs: async (params = {}) => {
    const response = await api.get('/admin/blogs', { params })
    return response.data
  },

  getAllComments: async (params = {}) => {
    const response = await api.get('/admin/comments', { params })
    return response.data
  },

  moderateComment: async (id, action) => {
    const response = await api.put(`/admin/comments/${id}/moderate`, { action })
    return response.data
  },

  // System Analytics
  getSystemStats: async () => {
    const response = await api.get('/admin/stats')
    return response.data
  },

  getActivityLogs: async (params = {}) => {
    const response = await api.get('/admin/activity-logs', { params })
    return response.data
  },

  // Content Moderation
  getContentForModeration: async (token, filters = {}) => {
    const response = await api.get('/admin/content', { 
      params: filters,
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  getContentStats: async (token) => {
    const response = await api.get('/admin/content/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  moderateContent: async (token, data) => {
    const response = await api.post('/admin/content/moderate', data, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  getContentDetails: async (token, type, id) => {
    const response = await api.get(`/admin/content/${type}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
}

export { adminService as AdminService }
