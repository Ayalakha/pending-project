import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import { 
  BarChart3, 
  TrendingUp, 
  Eye,
  Users, 
  Building2,
  Globe,
  Calendar,
  ArrowUp,
  ArrowDown,
  MousePointer,
  Clock,
  Target,
  Loader2,
  RefreshCw,
  Star,
  MessageSquare,
  Phone
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
  AreaChart,
  Area
} from 'recharts'

const MetricCard = ({ title, value, change, icon: Icon, color, format = 'number' }) => {
  const formatValue = (val) => {
    switch (format) {
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
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="text-2xl font-bold text-white mt-2">
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
            <ArrowUp className="h-4 w-4 text-green-400 mr-1" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-400 mr-1" />
          )}
          <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {Math.abs(change)}%
          </span>
          <span className="text-sm text-white/60 ml-1">vs last month</span>
        </div>
      )}
    </div>
  )
}

const AnalyticsChart = ({ title, data, type = 'line', height = 300 }) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" tick={{ fill: 'white' }} />
            <YAxis tick={{ fill: 'white' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px'
              }} 
            />
            <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        )
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" tick={{ fill: 'white' }} />
            <YAxis tick={{ fill: 'white' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px'
              }} 
            />
            <Area type="monotone" dataKey="value" stroke={colors[1]} fill={colors[1]} fillOpacity={0.3} />
          </AreaChart>
        )
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" tick={{ fill: 'white' }} />
            <YAxis tick={{ fill: 'white' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px'
              }} 
            />
            <Line type="monotone" dataKey="value" stroke={colors[0]} strokeWidth={3} dot={{ fill: colors[0], strokeWidth: 2, r: 4 }} />
          </LineChart>
        )
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  )
}

const OwnerAnalytics = () => {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState('30d')

  // Redirect if not owner
  if (!user || user.role !== 'owner') {
    return <Navigate to="/dashboard" replace />
  }

  // Mock data for now - in a real app, this would come from an API
  const mockData = {
    companyViews: 1247,
    profileClicks: 89,
    contactRequests: 23,
    averageRating: 4.5,
    totalReviews: 156,
    phoneClicks: 67,
    websiteVisits: 134
  }

  const viewsData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 700 },
    { name: 'Jun', value: 900 },
    { name: 'Jul', value: 1200 }
  ]

  const engagementData = [
    { name: 'Profile Views', value: 45 },
    { name: 'Contact Clicks', value: 25 },
    { name: 'Phone Clicks', value: 20 },
    { name: 'Website Visits', value: 10 }
  ]

  const performanceData = [
    { name: 'Week 1', value: 20 },
    { name: 'Week 2', value: 35 },
    { name: 'Week 3', value: 28 },
    { name: 'Week 4', value: 45 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Company Analytics</h1>
              <p className="text-white/70">Track your business performance and engagement</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="7d" className="text-gray-900">Last 7 days</option>
                <option value="30d" className="text-gray-900">Last 30 days</option>
                <option value="90d" className="text-gray-900">Last 90 days</option>
                <option value="1y" className="text-gray-900">Last year</option>
              </select>
              
              <button className="bg-blue-600/80 hover:bg-blue-600 backdrop-blur-md border border-blue-500/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Views"
            value={mockData.companyViews}
            change={12.5}
            icon={Eye}
            color="bg-blue-600"
          />
          
          <MetricCard
            title="Profile Clicks"
            value={mockData.profileClicks}
            change={8.2}
            icon={MousePointer}
            color="bg-green-600"
          />
          
          <MetricCard
            title="Contact Requests"
            value={mockData.contactRequests}
            change={-3.1}
            icon={MessageSquare}
            color="bg-purple-600"
          />
          
          <MetricCard
            title="Average Rating"
            value={mockData.averageRating}
            change={5.7}
            icon={Star}
            color="bg-yellow-600"
            format="rating"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnalyticsChart
            title="Company Views Over Time"
            data={viewsData}
            type="area"
            height={300}
          />
          
          <AnalyticsChart
            title="User Engagement"
            data={engagementData}
            type="bar"
            height={300}
          />
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsChart
              title="Weekly Performance"
              data={performanceData}
              type="line"
              height={300}
            />
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span className="text-white/80">Phone Clicks</span>
                </div>
                <span className="text-white font-semibold">{mockData.phoneClicks}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-green-400" />
                  <span className="text-white/80">Website Visits</span>
                </div>
                <span className="text-white font-semibold">{mockData.websiteVisits}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-white/80">Total Reviews</span>
                </div>
                <span className="text-white font-semibold">{mockData.totalReviews}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  <span className="text-white/80">Growth Rate</span>
                </div>
                <span className="text-green-400 font-semibold">+12.5%</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/20">
              <p className="text-xs text-white/60 mb-2">Performance Summary</p>
              <p className="text-sm text-white/80">
                Your company is performing well with steady growth in views and engagement. 
                Consider optimizing your profile to increase contact conversions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnerAnalytics
