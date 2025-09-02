import { useState, useEffect } from 'react'
import { useNavigate, useParams, Navigate, useLocation } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { companyService } from '../services/companyService'
import { useAuth } from '../contexts/AuthContext'
import {
  Building2,
  Loader2,
  ArrowLeft,
  AlertCircle,
  Save,
  X
} from 'lucide-react'

// Legal forms (Moroccan legal forms)
const LEGAL_FORMS = [
  { value: 'SARL', label: 'SARL (Société à Responsabilité Limitée)' },
  { value: 'SA', label: 'SA (Société Anonyme)' },
  { value: 'SARL_AU', label: 'SARL AU (SARL à Associé Unique)' },
  { value: 'SNC', label: 'SNC (Société en Nom Collectif)' },
  { value: 'SCS', label: 'SCS (Société en Commandite Simple)' },
  { value: 'SCA', label: 'SCA (Société en Commandite par Actions)' },
  { value: 'EP', label: 'EP (Entreprise Publique)' },
  { value: 'GIE', label: 'GIE (Groupement d\'Intérêt Économique)' },
  { value: 'EI', label: 'EI (Entreprise Individuelle)' }
]

// Moroccan regions
const MOROCCAN_REGIONS = [
  'Tanger-Tétouan-Al Hoceïma',
  'Oriental', 
  'Fès-Meknès',
  'Rabat-Salé-Kénitra',
  'Béni Mellal-Khénifra',
  'Casablanca-Settat',
  'Marrakech-Safi',
  'Drâa-Tafilalet',
  'Souss-Massa',
  'Guelmim-Oued Noun',
  'Laâyoune-Sakia El Hamra',
  'Dakhla-Oued Ed-Dahab'
]

// Common business sectors
const BUSINESS_SECTORS = [
  'Agriculture & Food',
  'Manufacturing', 
  'Technology',
  'Finance & Banking',
  'Healthcare',
  'Education',
  'Real Estate',
  'Transportation',
  'Retail & Commerce',
  'Energy & Utilities',
  'Telecommunications',
  'Tourism & Hospitality',
  'Construction',
  'Professional Services',
  'Media & Entertainment',
  'Non-Profit',
  'Government',
  'Other'
]

const CompanyFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const isEditing = Boolean(id)
  const { user, isAuthenticated } = useAuth()

  // Redirect if not authenticated or not an owner
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
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

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    website: '',
    phone_number: '',
    capital: '',
    rc: '',
    legal_form: 'SARL',
    city: '',
    region: '',
    ice: '',
    cnss: '',
    patent_number: '',
    activity_sector: '',
    incorporation_date: ''
  })

  const [errors, setErrors] = useState({})

  // Fetch company data for editing
  const { data: companyData, isLoading: isLoadingCompany, error: companyError } = useQuery({
    queryKey: ['company', id],
    queryFn: () => companyService.getCompany(id),
    enabled: isEditing,
    retry: false // Don't retry on 404
  })

  // Populate form when editing
  useEffect(() => {
    if (isEditing && companyData?.company) {
      const company = companyData.company
      setFormData({
        name: company.name || '',
        description: company.description || '',
        logo: company.logo || '',
        website: company.website || '',
        phone_number: company.phone_number || '',
        capital: company.capital || '',
        rc: company.rc || '',
        legal_form: company.legal_form || 'SARL',
        city: company.city || '',
        region: company.region || '',
        ice: company.ice || '',
        cnss: company.cnss || '',
        patent_number: company.patent_number || '',
        activity_sector: company.activity_sector || '',
        incorporation_date: company.incorporation_date || ''
      })
    }
  }, [isEditing, companyData])

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: (data) => {
      return isEditing
        ? companyService.updateCompany(id, data)
        : companyService.createCompany(data)
    },
    onSuccess: () => {
      navigate('/my-companies')
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        console.error('Error saving company:', error)
        alert('Failed to save company. Please try again.')
      }
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required'
    }

    if (!formData.legal_form) {
      newErrors.legal_form = 'Legal form is required'
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL'
    }

    if (formData.ice && !isValidTaxId(formData.ice)) {
      newErrors.ice = 'Please enter a valid tax ID number'
    }

    if (formData.phone_number && !isValidPhone(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const isValidTaxId = (taxId) => {
    return /^\d{9,15}$/.test(taxId)
  }

  const isValidPhone = (phone) => {
    // General phone number pattern
    return /^[\+]?[\d\s\-\(\)]{10,15}$/.test(phone.replace(/[\s-]/g, ''))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Clean up data before sending
      const cleanData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => {
          // Convert all values to strings, but handle special cases
          if (key === 'capital' && value !== '' && value !== null && value !== undefined) {
            return [key, String(value)]
          }
          return [
            key, 
            typeof value === 'string' ? value.trim() : value
          ]
        })
      )
      
      mutation.mutate(cleanData)
    }
  }

  if (isEditing && isLoadingCompany) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading company details...</span>
          </div>
        </div>
      </div>
    )
  }

  // Handle company not found error (404)
  if (isEditing && companyError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-red-800 mb-2">Company Not Found</h2>
            <p className="text-red-600 mb-4">
              The company you're trying to edit doesn't exist or has been deleted.
            </p>
            <button
              onClick={() => navigate('/my-companies')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to My Companies
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/my-companies')}
            className="flex items-center bg-white text-gray-600 hover:text-gray-900 mb-4 transition-colors focus:outline-none border-none"
          >

            <ArrowLeft className="h-4 w-4 mr-2 b" />
            Back to My Companies
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Edit Company' : 'Add New Company'}
              </h1>
              <p className="text-gray-600">
                {isEditing ? 'Update your company information' : 'Create a new business listing'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                placeholder="Enter your company name"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-vertical"
                placeholder="Describe your company and what you do..."
              />
            </div>

            {/* Logo URL */}
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                placeholder="https://example.com/logo.png"
              />
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${errors.website ? 'border-red-300' : 'border-gray-300'
                  }`}
                placeholder="https://yourcompany.com"
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">{errors.website}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${errors.phone_number ? 'border-red-300' : 'border-gray-300'
                  }`}
                placeholder="+1-555-123-4567"
              />
              {errors.phone_number && (
                <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
              )}
            </div>

            {/* Capital and Legal Form Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="capital" className="block text-sm font-medium text-gray-700 mb-2">
                  Capital ($)
                </label>
                <input
                  type="number"
                  id="capital"
                  name="capital"
                  value={formData.capital}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="100000"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label htmlFor="legal_form" className="block text-sm font-medium text-gray-700 mb-2">
                  Legal Form *
                </label>
                <select
                  id="legal_form"
                  name="legal_form"
                  value={formData.legal_form}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${errors.legal_form ? 'border-red-300' : 'border-gray-300'
                    }`}
                  required
                >
                  {LEGAL_FORMS.map(form => (
                    <option key={form.value} value={form.value}>
                      {form.label}
                    </option>
                  ))}
                </select>
                {errors.legal_form && (
                  <p className="mt-1 text-sm text-red-600">{errors.legal_form}</p>
                )}
              </div>
            </div>

            {/* Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="New York"
                />
              </div>

              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                  Region (Morocco)
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                >
                  <option value="">Select a region</option>
                  {MOROCCAN_REGIONS.map(region => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Business Registration Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="rc" className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  id="rc"
                  name="rc"
                  value={formData.rc}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="REG123456"
                />
              </div>

              <div>
                <label htmlFor="ice" className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ID Number
                </label>
                <input
                  type="text"
                  id="ice"
                  name="ice"
                  value={formData.ice}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${errors.ice ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="123456789"
                />
                {errors.ice && (
                  <p className="mt-1 text-sm text-red-600">{errors.ice}</p>
                )}
              </div>
            </div>

            {/* Additional Registration Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cnss" className="block text-sm font-medium text-gray-700 mb-2">
                  Social Security Number
                </label>
                <input
                  type="text"
                  id="cnss"
                  name="cnss"
                  value={formData.cnss}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="123456789"
                />
              </div>

              <div>
                <label htmlFor="patent_number" className="block text-sm font-medium text-gray-700 mb-2">
                  License Number
                </label>
                <input
                  type="text"
                  id="patent_number"
                  name="patent_number"
                  value={formData.patent_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="LIC123456"
                />
              </div>
            </div>

            {/* Business Sector and Incorporation Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="activity_sector" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Sector
                </label>
                <select
                  id="activity_sector"
                  name="activity_sector"
                  value={formData.activity_sector}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                >
                  <option value="">Select a sector</option>
                  {BUSINESS_SECTORS.map(sector => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="incorporation_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Incorporation Date
                </label>
                <input
                  type="date"
                  id="incorporation_date"
                  name="incorporation_date"
                  value={formData.incorporation_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/my-companies')}
                className="px-5 py-2.5 flex items-center  text-gray-600 bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 focus:outline-none font-medium shadow-sm  outline-none border-none"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isLoading}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {mutation.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
          
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? 'Update Company' : 'Create Company'}
                  </>
                )}
              </button>



            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CompanyFormPage
