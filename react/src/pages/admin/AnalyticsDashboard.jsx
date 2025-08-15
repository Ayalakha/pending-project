                      import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../../services/analyticsService'
import { useAuth } from '../../contexts/AuthContext'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2,
  DollarSign,
  Globe,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
  Eye,
  MousePointer,
  Clock,
  Target,
  Loader2,
  Filter,
  RefreshCw
} from 'lucide-react'
import { Navigate } from 'react-router-dom'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

const MetricCard = ({ title, value, change, icon: Icon, color, format = 'number' }) => {
  const formatValue = (val) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
      case 'percentage':
        return `${val}%`
      case 'time':
        return `${val}m`
      default:
        return new Intl.NumberFormat().format(val)
    }
  }

  const isPositive = change >= 0
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {formatValue(value)}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {change !== null && (
        <div className="mt-4 flex items-center">
          {isPositive ? (
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(change)}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last month</span>
        </div>
      )}
    </div>
  )
}

const AnalyticsChart = ({ title, data, type = 'line', height = 300 }) => {
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6']

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={colors[0]} />
          </BarChart>
        )
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="value" stroke={colors[0]} fill={colors[0]} fillOpacity={0.3} />
          </AreaChart>
        )
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke={colors[0]} strokeWidth={2} />
          </LineChart>
        )
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  )
}

const TopPerformersTable = ({ data, type }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Top {type === 'companies' ? 'Companies' : 'Content'}
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Engagement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Growth
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.views.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.engagement}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.growth >= 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.growth >= 0 ? '+' : ''}{item.growth}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const AnalyticsDashboard = () => {
  const { user, isAuthenticated } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('users')

  // Check admin permissions
  if (!isAuthenticated || user?.role !== 'superAdmin') {
    return <Navigate to="/login" replace />
  }

  // Fetch analytics data
  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: analyticsService.getPlatformStats,
    refetchInterval: 60000, // Refresh every minute
  })

  const { data: userEngagement, isLoading: userLoading } = useQuery({
    queryKey: ['analytics-users'],
    queryFn: analyticsService.getUserEngagement,
  })

  const { data: companyAnalytics, isLoading: companyLoading } = useQuery({
    queryKey: ['analytics-companies'],
    queryFn: analyticsService.getCompanyAnalytics,
  })

  const { data: trafficMetrics, isLoading: trafficLoading } = useQuery({
    queryKey: ['analytics-traffic'],
    queryFn: analyticsService.getTrafficMetrics,
  })

  const { data: revenueMetrics, isLoading: revenueLoading } = useQuery({
    queryKey: ['analytics-revenue'],
    queryFn: analyticsService.getRevenueMetrics,
  })

  const { data: timeSeriesData, isLoading: timeSeriesLoading } = useQuery({
    queryKey: ['analytics-timeseries', selectedMetric, selectedPeriod],
    queryFn: () => analyticsService.getTimeSeriesData(selectedMetric, selectedPeriod),
  })

  const { data: topPerformers, isLoading: topPerformersLoading } = useQuery({
    queryKey: ['analytics-top-performers'],
    queryFn: analyticsService.getTopPerformers,
  })

  const handleExport = async (type) => {
    try {
      const blob = await analyticsService.exportAnalytics(type, 'csv')
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `analytics-${type}-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  // Mock data for demonstration (replace with real data)
  const mockOverview = overviewData || {
    totalUsers: 2847,
    totalCompanies: 156,
    totalRevenue: 45230,
    avgSessionTime: 4.2,
    conversionRate: 3.4,
    bounceRate: 42.1
  }

  const mockTimeSeriesData = timeSeriesData || [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 700 },
    { name: 'Jun', value: 900 },
  ]

  const mockTopCompanies = topPerformers?.companies || [
    { name: 'TechCorp Inc', category: 'Technology', views: 12500, engagement: 8.5, growth: 15.2 },
    { name: 'Green Solutions', category: 'Environment', views: 9800, engagement: 7.2, growth: 12.1 },
    { name: 'Digital Marketing Pro', category: 'Marketing', views: 8200, engagement: 6.8, growth: -2.3 },
  ]

  if (overviewLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading analytics...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Comprehensive platform insights and performance metrics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={() => handleExport('overview')}
              className="btn-primary flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <MetricCard
            title="Total Users"
            value={mockOverview.totalUsers}
            change={12.5}
            icon={Users}
            color="bg-blue-500"
          />
          <MetricCard
            title="Companies"
            value={mockOverview.totalCompanies}
            change={8.2}
            icon={Building2}
            color="bg-green-500"
          />
          <MetricCard
            title="Revenue"
            value={mockOverview.totalRevenue}
            change={15.3}
            icon={DollarSign}
            color="bg-purple-500"
            format="currency"
          />
          <MetricCard
            title="Avg Session"
            value={mockOverview.avgSessionTime}
            change={-3.1}
            icon={Clock}
            color="bg-orange-500"
            format="time"
          />
          <MetricCard
            title="Conversion Rate"
            value={mockOverview.conversionRate}
            change={5.7}
            icon={Target}
            color="bg-indigo-500"
            format="percentage"
          />
          <MetricCard
            title="Bounce Rate"
            value={mockOverview.bounceRate}
            change={-2.4}
            icon={TrendingUp}
            color="bg-red-500"
            format="percentage"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnalyticsChart
            title="User Growth Over Time"
            data={mockTimeSeriesData}
            type="area"
          />
          <AnalyticsChart
            title="Traffic Sources"
            data={[
              { name: 'Direct', value: 35 },
              { name: 'Search', value: 45 },
              { name: 'Social', value: 15 },
              { name: 'Referral', value: 5 },
            ]}
            type="pie"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnalyticsChart
            title="Monthly Revenue"
            data={[
              { name: 'Jan', value: 12000 },
              { name: 'Feb', value: 15000 },
              { name: 'Mar', value: 18000 },
              { name: 'Apr', value: 22000 },
              { name: 'May', value: 25000 },
              { name: 'Jun', value: 28000 },
            ]}
            type="bar"
          />
          <AnalyticsChart
            title="User Engagement Metrics"
            data={[
              { name: 'Page Views', value: 85000 },
              { name: 'Sessions', value: 32000 },
              { name: 'Unique Users', value: 18000 },
              { name: 'Returning Users', value: 12000 },
            ]}
            type="bar"
          />
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <TopPerformersTable data={mockTopCompanies} type="companies" />
          <TopPerformersTable 
            data={[
              { name: 'How to Start a Business', category: 'Business', views: 15200, engagement: 9.2, growth: 18.5 },
              { name: 'Digital Marketing Guide', category: 'Marketing', views: 12800, engagement: 8.7, growth: 14.2 },
              { name: 'Tech Trends 2025', category: 'Technology', views: 11500, engagement: 7.9, growth: 8.3 },
            ]} 
            type="content" 
          />
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
