import api from './api'

export const analyticsService = {
  // User Engagement Metrics
  getUserEngagement: () => 
    api.get('/admin/analytics/users').then(res => res.data),

  // Company Performance Analytics
  getCompanyAnalytics: () => 
    api.get('/admin/analytics/companies').then(res => res.data),

  // Traffic and Conversion Tracking
  getTrafficMetrics: () => 
    api.get('/admin/analytics/traffic').then(res => res.data),

  // Revenue and Growth Charts
  getRevenueMetrics: () => 
    api.get('/admin/analytics/revenue').then(res => res.data),

  // Platform Overview Stats
  getPlatformStats: () => 
    api.get('/admin/analytics/overview').then(res => res.data),

  // Time-based Analytics
  getTimeSeriesData: (metric, period = '30d') => 
    api.get(`/admin/analytics/timeseries?metric=${metric}&period=${period}`).then(res => res.data),

  // Export Functionality
  exportAnalytics: (type, format = 'csv') => 
    api.get(`/admin/analytics/export?type=${type}&format=${format}`, {
      responseType: 'blob'
    }).then(res => res.data),

  // Geographic Analytics
  getGeographicData: () => 
    api.get('/admin/analytics/geographic').then(res => res.data),

  // User Behavior Analytics
  getUserBehavior: () => 
    api.get('/admin/analytics/behavior').then(res => res.data),

  // Content Performance
  getContentAnalytics: () => 
    api.get('/admin/analytics/content').then(res => res.data),

  // Real-time Analytics
  getRealTimeStats: () => 
    api.get('/admin/analytics/realtime').then(res => res.data),

  // Comparison Analytics
  getComparisonData: (startDate, endDate) => 
    api.get(`/admin/analytics/comparison?start=${startDate}&end=${endDate}`).then(res => res.data),

  // Top Performers
  getTopPerformers: () => 
    api.get('/admin/analytics/top-performers').then(res => res.data),

  // Growth Metrics
  getGrowthMetrics: () => 
    api.get('/admin/analytics/growth').then(res => res.data)
}
