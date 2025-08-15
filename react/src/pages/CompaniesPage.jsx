import { useQuery } from '@tanstack/react-query'
import { companyService } from '../services/companyService'
import { Building2, MapPin, Phone, Globe, Users, Loader2, Search, X, ArrowRight, Star, Filter } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

const CompanyCard = ({ company }) => {
  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-100/50 hover:border-blue-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start space-x-6">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          {company.logo ? (
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="w-20 h-20 rounded-2xl object-cover shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Building2 className="h-10 w-10 text-white" />
            </div>
          )}
        </div>

        {/* Company Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
              {company.name}
            </h3>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
          
          <p className="text-gray-600 text-lg mb-6 line-clamp-2 leading-relaxed">
            {company.description}
          </p>

          {/* Company Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {company.phone_number && (
              <div className="flex items-center text-gray-600 bg-gray-50/50 rounded-xl px-4 py-2">
                <Phone className="h-4 w-4 mr-3 text-blue-500" />
                <span className="font-medium">{company.phone_number}</span>
              </div>
            )}
            {company.website && (
              <div className="flex items-center text-gray-600 bg-gray-50/50 rounded-xl px-4 py-2">
                <Globe className="h-4 w-4 mr-3 text-emerald-500" />
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Visit Website
                </a>
              </div>
            )}
            {company.services_or_products && (
              <div className="flex items-center text-gray-600 bg-gray-50/50 rounded-xl px-4 py-2 md:col-span-2">
                <Users className="h-4 w-4 mr-3 text-purple-500" />
                <span className="font-medium">{company.services_or_products.length} services/products</span>
              </div>
            )}
          </div>
        </div>

        {/* View Details Button */}
        <div className="flex-shrink-0">
          <Link
            to={`/companies/${company.id}`}
            className="group/btn bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  )
}

const CompaniesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [localSearch, setLocalSearch] = useState('')
  const searchQuery = searchParams.get('search') || ''

  // Sync local search with URL search params
  useEffect(() => {
    console.log('URL search params changed:', searchQuery)
    console.log('Current full URL:', window.location.href)
    setLocalSearch(searchQuery)
  }, [searchQuery])

  const { data, isLoading, error } = useQuery({
    queryKey: ['companies', searchQuery],
    queryFn: () => companyService.getCompanies(searchQuery ? { search: searchQuery } : {}),
  })

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Search submitted:', localSearch.trim())
    console.log('Current URL:', window.location.href)
    
    if (localSearch.trim()) {
      // Update URL with search parameter
      const newParams = new URLSearchParams(searchParams)
      newParams.set('search', localSearch.trim())
      setSearchParams(newParams)
      console.log('Setting search params to:', newParams.toString())
    } else {
      // Clear search if empty
      const newParams = new URLSearchParams(searchParams)
      newParams.delete('search')
      setSearchParams(newParams)
      console.log('Clearing search params')
    }
  }

  const clearSearch = () => {
    console.log('Clearing search')
    setLocalSearch('')
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('search')
    setSearchParams(newParams)
    console.log('Search cleared, new URL should be:', window.location.pathname)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Companies</h2>
            <p className="text-gray-600">Fetching the latest business directory...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-32">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Unable to Load Companies</h1>
            <p className="text-xl text-gray-600 mb-8">
              {error.message || 'Something went wrong. Please try again later.'}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const companies = data?.companies?.data || data?.companies || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Header Section */}
      <section className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-600 text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_70%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.05),transparent_70%)]"></div>
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              <span>{companies.length} Verified Companies</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {searchQuery ? (
                <span className="block">
                  <span className="text-blue-200">Search Results for</span>
                  <span className="block text-white">"{searchQuery}"</span>
                </span>
              ) : (
                <span className="block">
                  <span className="text-blue-200">Discover Amazing</span>
                  <span className="block text-white">Businesses</span>
                </span>
              )}
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              {searchQuery 
                ? `Found ${companies.length} companies matching your search criteria`
                : 'Explore our curated directory of verified businesses and professional services'
              }
            </p>

            {/* Enhanced Search Bar */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2">
                  <div className="flex items-center">
                    <div className="flex-1 relative">
                      <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/60 h-6 w-6" />
                      <input
                        type="text"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        placeholder="Search companies by name, description, or services..."
                        className="w-full pl-16 pr-16 py-5 bg-transparent text-white placeholder-white/60 text-lg focus:outline-none"
                      />
                      {localSearch && (
                        <button
                          type="button"
                          onClick={clearSearch}
                          className="absolute right-20 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-300"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-5 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                    >
                      <span>Search</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {searchQuery && (
              <div className="mt-8">
                <button
                  onClick={clearSearch}
                  className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {companies.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Building2 className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                No Companies Found
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                {searchQuery 
                  ? 'Try adjusting your search terms or browse all companies'
                  : 'Be the first to add your company to our directory!'
                }
              </p>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  View All Companies
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {searchQuery ? 'Search Results' : 'All Companies'}
                  </h2>
                  <p className="text-gray-600">
                    Showing {companies.length} {companies.length === 1 ? 'company' : 'companies'}
                  </p>
                </div>
                
                {/* Future filters can go here */}
                <div className="hidden md:flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-xl">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 font-medium">Sort by relevance</span>
                  </div>
                </div>
              </div>

              {/* Companies Grid */}
              <div className="space-y-8">
                {companies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default CompaniesPage
