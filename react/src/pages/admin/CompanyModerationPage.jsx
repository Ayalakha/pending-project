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
  Eye,
  TrendingUp,
  Users,
  Store
} from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'

const CompanyCard = ({ company, onUpdate }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const queryClient = useQueryClient()

  const approveMutation = useMutation({
    mutationFn: (companyId) => adminService.approveCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCompanies'])
      onUpdate()
      setShowApproveModal(false)
    }
  })

  const rejectMutation = useMutation({
    mutationFn: ({ companyId, reason }) => adminService.rejectCompany(companyId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCompanies'])
      onUpdate()
      setShowRejectModal(false)
      setRejectionReason('')
    }
  })

  const handleApprove = () => {
    approveMutation.mutate(company.id)
  }

  const handleReject = () => {
    rejectMutation.mutate({ companyId: company.id, reason: rejectionReason })
  }

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      active: 'success',
      inactive: 'destructive'
    }
    const labels = {
      pending: 'Pending Review',
      active: 'Approved',
      inactive: 'Rejected'
    }
    return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>
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

  const ownerName = [company.owner?.first_name, company.owner?.last_name].filter(Boolean).join(' ') || 'Unknown User'

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                {getStatusBadge(company.status)}
              </div>
            </div>
            <p className="text-gray-600 line-clamp-2 mb-4">{company.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                <span>{ownerName}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span>{formatDate(company.created_at)}</span>
              </div>
              {company.location && (
                <div className="flex items-center text-gray-600 col-span-2">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{company.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Website Link */}
        {company.website && (
          <div className="mb-6">
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Website
            </a>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showDetails ? 'Hide Details' : 'View Details'}
          </Button>

          {(company.status === 'pending' || !company.status) && (
            <div className="flex items-center gap-3">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowRejectModal(true)}
                disabled={rejectMutation.isLoading}
                className="shadow-sm"
              >
                {rejectMutation.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <X className="h-4 w-4 mr-2" />
                )}
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => setShowApproveModal(true)}
                disabled={approveMutation.isLoading}
                className="bg-green-600 hover:bg-green-700 shadow-sm"
              >
                {approveMutation.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Approve
              </Button>
            </div>
          )}
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-4 bg-gray-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Full Description</h4>
                  <p className="text-sm text-gray-600 bg-white p-3 rounded border">{company.description}</p>
                </div>
                
                {company.industry && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Industry</h4>
                    <p className="text-sm text-gray-600">{company.industry}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {company.size && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Company Size</h4>
                    <p className="text-sm text-gray-600">{company.size}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Owner Information</h4>
                  <div className="text-sm text-gray-600 bg-white p-3 rounded border">
                    <div><strong>Name:</strong> {ownerName}</div>
                    <div><strong>Email:</strong> {company.owner?.email}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Submission Date</h4>
                  <p className="text-sm text-gray-600">{formatDate(company.created_at)}</p>
                </div>

                {company.status === 'inactive' && company.rejection_reason && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Rejection Reason</h4>
                    <p className="text-sm text-red-700 bg-red-50 p-3 rounded border border-red-100">{company.rejection_reason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Approve Modal */}
        {showApproveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl transform transition-all">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Approve Company</h3>
                <p className="text-gray-600">
                  Are you sure you want to approve <strong>"{company.name}"</strong> for listing?
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  onClick={() => setShowApproveModal(false)}
                  variant="outline"
                  disabled={approveMutation.isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={approveMutation.isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {approveMutation.isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl transform transition-all">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Company</h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to reject <strong>"{company.name}"</strong>?
                </p>
                
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for rejection (optional):
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                    rows="3"
                    placeholder="Provide a reason for the rejection..."
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  onClick={() => {
                    setShowRejectModal(false)
                    setRejectionReason('')
                  }}
                  variant="outline"
                  disabled={rejectMutation.isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={rejectMutation.isLoading}
                  variant="destructive"
                >
                  {rejectMutation.isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const CompanyModerationPage = () => {
  const { user, isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

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

  // Check admin permissions
  if (!isAuthenticated || user?.role !== 'superAdmin') {
    return <Navigate to="/login" replace />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Loading companies...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="container mx-auto px-6 max-w-7xl">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-6" />
              <h2 className="text-lg font-medium text-red-800 mb-2">Error Loading Companies</h2>
              <p className="text-red-600 mb-4">Failed to load company data. Please try again later.</p>
              <Button onClick={handleRefresh} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Company Moderation
          </h1>
          <p className="text-lg text-gray-600">
            Review and moderate company listings submitted by business owners
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-3xl font-bold text-gray-900">{statusCounts.pending || 0}</p>
                  <div className="flex items-center text-sm text-yellow-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>Awaiting action</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-gray-900">{statusCounts.active || 0}</p>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <Store className="h-3 w-3 mr-1" />
                    <span>Active listings</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-gray-900">{statusCounts.inactive || 0}</p>
                  <div className="flex items-center text-sm text-red-600 mt-1">
                    <X className="h-3 w-3 mr-1" />
                    <span>Declined</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Companies</p>
                  <p className="text-3xl font-bold text-gray-900">{companies.length}</p>
                  <div className="flex items-center text-sm text-blue-600 mt-1">
                    <Users className="h-3 w-3 mr-1" />
                    <span>All submissions</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search companies by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="active">Approved</option>
                    <option value="inactive">Rejected</option>
                  </select>
                </div>
                
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  className="bg-white hover:bg-gray-50"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Companies List */}
        <div className="space-y-6">
          {companies.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No companies have been submitted yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            companies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onUpdate={handleRefresh}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyModerationPage
