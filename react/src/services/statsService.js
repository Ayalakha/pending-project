import api from './api'

export const statsService = {
  // Get public platform stats (homepage)
  getStats: async () => {
    const response = await api.get('/stats')
    return response.data
  }
}
