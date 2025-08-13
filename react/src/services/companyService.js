import api from './api'

export const companyService = {
  // Get all companies with pagination
  getCompanies: async (params = {}) => {
    const response = await api.get('/companies', { params })
    return response.data
  },

  // Get single company by ID
  getCompany: async (id) => {
    const response = await api.get(`/companies/${id}`)
    return response.data
  },

  // Create new company (owner only)
  createCompany: async (data) => {
    const response = await api.post('/companies', data)
    return response.data
  },

  // Update company (owner only)
  updateCompany: async (id, data) => {
    const response = await api.put(`/companies/${id}`, data)
    return response.data
  },

  // Delete company (owner only)
  deleteCompany: async (id) => {
    const response = await api.delete(`/companies/${id}`)
    return response.data
  },

  // Search companies
  searchCompanies: async (query) => {
    const response = await api.get('/companies', {
      params: { search: query }
    })
    return response.data
  },

  // Get owner's companies (authenticated)
  getMyCompanies: async () => {
    const response = await api.get('/my-companies')
    return response.data
  }
}
