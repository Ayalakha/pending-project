import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Building2, 
  Search, 
  Filter,
  Clock,
  Check,
  X,
  ExternalLink,
  MapPin,
  User,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react'
import { Navigate } from 'react-router-dom'

const CompanyCard = ({ company, onUpdate }) => {
  const [showDetails, setShowDetails] = useState(false)
  const queryClient = useQueryClient()

  const approveMutation = useMutation({
    mutationFn: (companyId) => adminService.approveCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCompanies'])
      onUpdate()
    }
  })

  const rejectMutation = useMutation({
    mutationFn: ({ companyId, reason }) => adminService.rejectCompany(companyId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCompanies'])
      onUpdate()
    }
  })

  const handleApprove = () => {
    if (window.confirm(`Approve "${company.name}" for listing?`)) {
      approveMutation.mutate(company.id)
    }
  }

  const handleReject = () => {
    const reason = prompt('Reason for rejection (optional):')
    if (reason !== null) { // User didn't cancel
      rejectMutation.mutate({ companyId: company.id, reason })
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending Review' },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' }
    }
    const badge = badges[status] || badges.pending
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <Building2 className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{company.description}</p>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {company.user?.username || 'Unknown User'}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(company.created_at)}
              </div>
              {company.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {company.location}
                </div>
              )}
            </div>
          </div>
          <div className="ml-4">
            {getStatusBadge(company.status || 'pending')}
          </div>
        </div>

        {/* Website Link */}
        {company.website && (
          <div className="mb-4">
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Visit Website
            </a>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm"
          >
            <Eye className="h-4 w-4 mr-1" />
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>

          {(company.status === 'pending' || !company.status) && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleReject}
                disabled={rejectMutation.isLoading}
                className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {rejectMutation.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <X className="h-4 w-4 mr-1" />
                )}
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={approveMutation.isLoading}
                className="inline-flex items-center px-3 py-1.5 border border-green-300 text-green-700 bg-green-50 hover:bg-green-100 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {approveMutation.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                Approve
              </button>
            </div>
          )}
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Full Description</h4>
              <p className="text-sm text-gray-600">{company.description}</p>
            </div>
            
            {company.industry && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Industry</h4>
                <p className="text-sm text-gray-600">{company.industry}</p>
              </div>
            )}
            
            {company.size && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Company Size</h4>
                <p className="text-sm text-gray-600">{company.size}</p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Owner Information</h4>
              <p className="text-sm text-gray-600">
                {company.user?.username} ({company.user?.email})
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Submission Date</h4>
              <p className="text-sm text-gray-600">{formatDate(company.created_at)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const CompanyModerationPage = () => {
  const { user, isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Check admin permissions
  if (!isAuthenticated || user?.role !== 'superAdmin') {
    return <Navigate to="/login" replace />
  }

  // Fetch companies
  const { data: companiesData, isLoading, error, refetch } = useQuery({
    queryKey: ['adminCompanies', searchTerm, statusFilter],
    queryFn: () => adminService.getAllCompanies({
      search: searchTerm,
      status: statusFilter
    }),
    keepPreviousData: true,
  })

  const companies = companiesData?.companies || []

  const handleRefresh = () => {
    refetch()
  }

  // Get counts by status
  const statusCounts = companies.reduce((acc, company) => {
    const status = company.status || 'pending'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading companies...</span>
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
            <h2 className="text-lg font-medium text-red-800 mb-2">Error Loading Companies</h2>
            <p className="text-red-600">Failed to load company data. Please try again later.</p>
            <button onClick={handleRefresh} className="mt-4 btn-primary">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Moderation</h1>
          <p className="text-gray-600">
            Review and moderate company listings submitted by business owners
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.pending || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.approved || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.rejected || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <button
                onClick={handleRefresh}
                className="btn-primary"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        {companies.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {companies.map((company) => (
              <CompanyCard 
                key={company.id} 
                company={company} 
                onUpdate={handleRefresh}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Companies Found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter 
                ? 'No companies match your current filters.' 
                : 'No companies have been submitted for review yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompanyModerationPage
