import api from './api'

export const reviewService = {
  // Get reviews for a company
  getCompanyReviews: async (companyId) => {
    const response = await api.get(`/companies/${companyId}/reviews`)
    return response.data
  },

  // Submit a new review
  submitReview: async (companyId, reviewData) => {
    const response = await api.post(`/companies/${companyId}/reviews`, reviewData)
    return response.data
  },

  // Update existing review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData)
    return response.data
  },

  // Delete review
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`)
    return response.data
  },

  // Get user's review for a specific company
  getUserReview: async (companyId) => {
    const response = await api.get(`/companies/${companyId}/user-review`)
    return response.data
  },

  // Toggle helpful vote on review
  toggleHelpful: async (reviewId) => {
    const response = await api.post(`/reviews/${reviewId}/helpful`)
    return response.data
  }
}
