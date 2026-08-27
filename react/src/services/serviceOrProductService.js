import api from './api'

export const serviceOrProductService = {
  // Get all services/products for a company
  getServicesOrProducts: async (companyId) => {
    const response = await api.get(`/companies/${companyId}/services-products`)
    return response.data
  },

  // Create a new service/product for a company (owner only)
  createServiceOrProduct: async (companyId, data) => {
    const response = await api.post(`/companies/${companyId}/services-products`, data)
    return response.data
  },

  // Update a service/product (owner only)
  updateServiceOrProduct: async (id, data) => {
    const response = await api.put(`/services-products/${id}`, data)
    return response.data
  },

  // Delete a service/product (owner only)
  deleteServiceOrProduct: async (id) => {
    const response = await api.delete(`/services-products/${id}`)
    return response.data
  }
}
