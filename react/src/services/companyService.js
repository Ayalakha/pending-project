import api from './api'

// Company create/update payloads may include a File for `logo`, so they're always
// sent as multipart/form-data. `logo` is only appended when it's a new File - an
// existing logo URL (string) means "leave it as is". `remove_logo: true` clears it.
const buildCompanyFormData = (data) => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'logo') {
      if (value instanceof File) {
        formData.append('logo', value)
      }
    } else if (key === 'remove_logo') {
      if (value) {
        formData.append('remove_logo', '1')
      }
    } else if (value !== null && value !== undefined) {
      formData.append(key, value)
    }
  })

  return formData
}

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
    // Override the instance's default JSON Content-Type - with it set explicitly,
    // axios JSON-serializes FormData bodies instead of sending them as multipart.
    const response = await api.post('/companies', buildCompanyFormData(data), {
      headers: { 'Content-Type': undefined }
    })
    return response.data
  },

  // Update company (owner only)
  updateCompany: async (id, data) => {
    const formData = buildCompanyFormData(data)
    // Laravel needs POST + _method spoofing for multipart PUT bodies -
    // PHP doesn't populate uploaded files for a real PUT request.
    formData.append('_method', 'PUT')
    const response = await api.post(`/companies/${id}`, formData, {
      headers: { 'Content-Type': undefined }
    })
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
