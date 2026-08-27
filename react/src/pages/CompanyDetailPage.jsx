import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { companyService } from '../services/companyService'
import ReviewList from '../components/reviews/ReviewList'
import CompanyLogo from '../components/company/CompanyLogo'
import {
  MapPin,
  Phone, 
  Globe, 
  Mail, 
  DollarSign, 
  FileText, 
  ArrowLeft, 
  Loader2,
  ExternalLink,
  Tag,
  Users,
  Star
} from 'lucide-react'

const ServiceCard = ({ service }) => {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              service.type === 'service' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {service.type}
            </span>
          </div>
          <p className="text-gray-600 mb-3">{service.description}</p>
        </div>
        <div className="text-right ml-4">
          <div className="text-2xl font-bold text-primary-600">
            ${service.price}
          </div>
          <div className="text-sm text-gray-500">
            {service.type === 'service' ? 'per service' : 'per item'}
          </div>
        </div>
      </div>
    </div>
  )
}

const CompanyDetailPage = () => {
  const { id } = useParams()
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['company', id],
    queryFn: () => companyService.getCompany(id),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading company details...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Company Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error.message || 'The company you are looking for could not be found.'}
          </p>
          <Link to="/companies" className="btn-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Companies
          </Link>
        </div>
      </div>
    )
  }

  const company = data?.company

  if (!company) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Company Not Found</h1>
          <Link to="/companies" className="btn-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Companies
          </Link>
        </div>
      </div>
    )
  }

  const services = company.services_or_products || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          to="/companies" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Companies
        </Link>
      </div>

      {/* Company Header */}
      <div className="card mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <CompanyLogo
              company={company}
              sizeClassName="w-32 h-32"
              roundedClassName="rounded-xl"
              textClassName="text-3xl"
              extraClassName="border border-gray-200"
            />
          </div>

          {/* Company Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{company.name}</h1>
            <p className="text-lg text-gray-600 mb-6">{company.description}</p>

            {/* Company Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{services.length}</div>
                <div className="text-sm text-gray-600">Services/Products</div>
              </div>
              {company.capital && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{company.capital}</div>
                  <div className="text-sm text-gray-600">Capital</div>
                </div>
              )}
              {company.legal_form && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{company.legal_form}</div>
                  <div className="text-sm text-gray-600">Legal Form</div>
                </div>
              )}
              {company.rc && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{company.rc}</div>
                  <div className="text-sm text-gray-600">Registration</div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.phone_number && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-primary-600" />
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium">{company.phone_number}</div>
                  </div>
                </div>
              )}
              {company.website && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Globe className="h-5 w-5 text-primary-600" />
                  <div>
                    <div className="text-sm text-gray-600">Website</div>
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-primary-600 hover:text-primary-700 flex items-center"
                    >
                      Visit Website
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Services and Products */}
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Tag className="h-6 w-6 mr-2 text-primary-600" />
            Services & Products
          </h2>

          {services.length === 0 ? (
            <div className="card text-center py-12">
              <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No services or products listed
              </h3>
              <p className="text-gray-600">
                This company hasn't added any services or products yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Star className="h-6 w-6 mr-2 text-primary-600" />
            Reviews & Ratings
          </h2>
          <ReviewList companyId={company.id} />
        </div>

        {/* Contact Section */}
        <div className="card bg-primary-50 border-primary-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Interested in {company.name}?
            </h3>
            <p className="text-gray-600 mb-6">
              Get in touch with them to learn more about their services and how they can help you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {company.phone_number && (
                <a 
                  href={`tel:${company.phone_number}`}
                  className="btn-primary inline-flex items-center justify-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </a>
              )}
              {company.website && (
                <a 
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center justify-center"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyDetailPage
