import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { companyService } from '../services/companyService'
import { useAuth } from '../contexts/AuthContext'
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Globe, 
  Phone, 
  MapPin,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { useState } from 'react'

const CompanyCard = ({ company, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${company.name}"? This action cannot be undone.`)) {
      setIsDeleting(true)
      try {
        await onDelete(company.id)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            {company.logo ? (
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-8 w-8 text-primary-600" />
              </div>
            )}
          </div>

          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {company.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {company.description || 'No description provided'}
            </p>

            {/* Company Details */}
            <div className="space-y-1">
              {company.phone_number && (
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-4 w-4 mr-2" />
                  {company.phone_number}
                </div>
              )}
              {company.website && (
                <div className="flex items-center text-sm text-gray-500">
                  <Globe className="h-4 w-4 mr-2" />
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 truncate"
                  >
                    {company.website}
                  </a>
                </div>
              )}
              {company.legal_form && (
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  {company.legal_form} • {company.capital || 'Capital not specified'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-4">
          <Link
            to={`/companies/${company.id}`}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            title="View Details"
          >
            <Globe className="h-4 w-4" />
          </Link>
          <Link
            to={`/companies/${company.id}/edit`}
            className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
            title="Edit Company"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            title="Delete Company"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

const MyCompaniesPage = () => {
  const { user, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  // Redirect if not authenticated or not an owner
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'owner' && user?.role !== 'superAdmin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">Only business owners can access this page.</p>
        </div>
      </div>
    )
  }

  // Fetch user's companies
  const { data: companiesData, isLoading, error } = useQuery({
    queryKey: ['myCompanies'],
    queryFn: companyService.getMyCompanies,
  })

  // Delete company mutation
  const deleteMutation = useMutation({
    mutationFn: companyService.deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries(['myCompanies'])
    },
    onError: (error) => {
      console.error('Error deleting company:', error)
      alert('Failed to delete company. Please try again.')
    }
  })

  const companies = companiesData?.companies || []

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading your companies...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-red-800 mb-2">Error Loading Companies</h2>
          <p className="text-red-600">Failed to load your companies. Please try again later.</p>
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
            <h1 className="text-3xl font-bold text-gray-900">My Companies</h1>
            <p className="text-gray-600 mt-2">
              Manage your business listings and track their performance
            </p>
          </div>
          <Link 
            to="/companies/new"
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Company
          </Link>
        </div>

        {/* Companies Grid */}
        {companies.length > 0 ? (
          <div className="space-y-6">
            {companies.map((company) => (
              <CompanyCard 
                key={company.id} 
                company={company} 
                onDelete={deleteMutation.mutate}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-4">
              No Companies Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't added any companies to your profile yet. 
              Start by creating your first business listing to reach more customers.
            </p>
            <Link 
              to="/companies/new"
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Company
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyCompaniesPage
