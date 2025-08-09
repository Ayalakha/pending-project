import { useQuery } from '@tanstack/react-query'
import { companyService } from '../services/companyService'
import { Building2, MapPin, Phone, Globe, Users, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const CompanyCard = ({ company }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start space-x-4">
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
            {company.description}
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
                  className="text-primary-600 hover:text-primary-700"
                >
                  Visit Website
                </a>
              </div>
            )}
            {company.services_or_products && (
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-2" />
                {company.services_or_products.length} services/products
              </div>
            )}
          </div>
        </div>

        {/* View Details Button */}
        <div className="flex-shrink-0">
          <Link
            to={`/companies/${company.id}`}
            className="btn-primary text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

const CompaniesPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: () => companyService.getCompanies(),
  })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading companies...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Companies</h1>
          <p className="text-gray-600">
            {error.message || 'Something went wrong. Please try again later.'}
          </p>
        </div>
      </div>
    )
  }

  const companies = data?.companies?.data || data?.companies || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          All Companies
        </h1>
        <p className="text-gray-600">
          Discover businesses and services in our directory
        </p>
      </div>

      {/* Companies Grid */}
      {companies.length === 0 ? (
        <div className="text-center py-16">
          <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No companies found
          </h3>
          <p className="text-gray-600">
            Be the first to add your company to our directory!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CompaniesPage
