import { useState, useEffect } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
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

const CompanyFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  const { user, isAuthenticated } = useAuth()

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

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    website: '',
    phone_number: '',
    capital: '',
    rc: '',
    legal_form: ''
  })

  const [errors, setErrors] = useState({})

  // Fetch company data for editing
  const { data: companyData, isLoading: isLoadingCompany } = useQuery({
    queryKey: ['company', id],
    queryFn: () => companyService.getCompany(id),
    enabled: isEditing,
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
        legal_form: company.legal_form || ''
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

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL'
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

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Clean up data before sending
      const cleanData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value.trim()])
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                placeholder="+1-555-0123"
              />
            </div>

            {/* Capital and Legal Form Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="capital" className="block text-sm font-medium text-gray-700 mb-2">
                  Capital
                </label>
                <input
                  type="text"
                  id="capital"
                  name="capital"
                  value={formData.capital}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="1,000,000 USD"
                />
              </div>

              <div>
                <label htmlFor="legal_form" className="block text-sm font-medium text-gray-700 mb-2">
                  Legal Form
                </label>
                <select
                  id="legal_form"
                  name="legal_form"
                  value={formData.legal_form}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                >
                  <option value="">Select legal form</option>
                  <option value="LLC">LLC</option>
                  <option value="Corporation">Corporation</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* RC Number */}
            <div>
              <label htmlFor="rc" className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number (RC)
              </label>
              <input
                type="text"
                id="rc"
                name="rc"
                value={formData.rc}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                placeholder="RC-COMPANY-001"
              />
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
