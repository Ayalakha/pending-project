import { useQuery } from '@tanstack/react-query'
import { companyService } from '../services/companyService'
import StarRating from '../components/reviews/StarRating'
import { Building2, MapPin, Phone, Globe, Users, Loader2, Search, X, ArrowRight, Star, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
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
            <div className="flex items-center space-x-2">
              <StarRating 
                rating={Math.round(company.average_rating || 0)} 
                readOnly 
                size="w-4 h-4" 
              />
              <span className="text-sm text-gray-500">
                ({company.total_reviews || 0})
              </span>
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
  const [currentPage, setCurrentPage] = useState(1)
  const searchQuery = searchParams.get('search') || ''
  const categoryFilter = searchParams.get('category') || ''
  // Category values arrive lowercased from links like the homepage's category cards
  const categoryLabel = categoryFilter.replace(/\b\w/g, (c) => c.toUpperCase())
  const pageFromUrl = parseInt(searchParams.get('page')) || 1

  // Sync local search with URL search params
  useEffect(() => {
    console.log('URL search params changed:', searchQuery)
    console.log('Current full URL:', window.location.href)
    setLocalSearch(searchQuery)
    setCurrentPage(pageFromUrl)
  }, [searchQuery, pageFromUrl])

  const { data, isLoading, error } = useQuery({
    queryKey: ['companies', searchQuery, categoryFilter, currentPage],
    queryFn: () => {
      const params = {}
      if (searchQuery) params.search = searchQuery
      if (categoryFilter) params.category = categoryFilter
      if (currentPage > 1) params.page = currentPage
      return companyService.getCompanies(params)
    },
  })

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Search submitted:', localSearch.trim())
    console.log('Current URL:', window.location.href)

    setCurrentPage(1) // Reset to first page when searching

    // Preserve the active category filter (if any) while updating the search term
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('page')
    if (localSearch.trim()) {
      newParams.set('search', localSearch.trim())
    } else {
      newParams.delete('search')
    }
    setSearchParams(newParams)
    console.log('Setting search params to:', newParams.toString())
  }

  const clearSearch = () => {
    console.log('Clearing search')
    setLocalSearch('')
    setCurrentPage(1)
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('search')
    newParams.delete('page')
    setSearchParams(newParams)
    console.log('Search cleared, new URL should be:', window.location.pathname)
  }

  const clearCategory = () => {
    setCurrentPage(1)
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('category')
    newParams.delete('page')
    setSearchParams(newParams)
  }

  const clearAllFilters = () => {
    setLocalSearch('')
    setCurrentPage(1)
    setSearchParams({})
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    const newParams = new URLSearchParams(searchParams)
    if (page > 1) {
      newParams.set('page', page.toString())
    } else {
      newParams.delete('page')
    }
    setSearchParams(newParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
  const pagination = data?.companies?.current_page ? data.companies : null

  // Pagination Component
  const PaginationControls = () => {
    if (!pagination || !pagination.last_page || pagination.last_page <= 1) return null

    const currentPage = pagination.current_page
    const lastPage = pagination.last_page
    const hasNext = pagination.next_page_url
    const hasPrev = pagination.prev_page_url

    return (
      <div className="flex items-center justify-center space-x-2 mt-12">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPrev}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            hasPrev
              ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {/* First page */}
          {currentPage > 2 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="w-10 h-10 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                1
              </button>
              {currentPage > 3 && (
                <span className="text-gray-400 px-2">...</span>
              )}
            </>
          )}

          {/* Previous page */}
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="w-10 h-10 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              {currentPage - 1}
            </button>
          )}

          {/* Current page */}
          <button
            className="w-10 h-10 rounded-lg font-medium bg-blue-600 text-white"
            disabled
          >
            {currentPage}
          </button>

          {/* Next page */}
          {currentPage < lastPage && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="w-10 h-10 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              {currentPage + 1}
            </button>
          )}

          {/* Last page */}
          {currentPage < lastPage - 1 && (
            <>
              {currentPage < lastPage - 2 && (
                <span className="text-gray-400 px-2">...</span>
              )}
              <button
                onClick={() => handlePageChange(lastPage)}
                className="w-10 h-10 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                {lastPage}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNext}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            hasNext
              ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Header Section */}
      <section className="relative bg-gradient-to-b from-white to-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            {/* Simple Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-8">
              <Building2 className="w-4 h-4" />
              <span>{pagination?.total || companies.length} Companies</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {searchQuery ? (
                <span>Search Results for "{searchQuery}"</span>
              ) : categoryFilter ? (
                <span>{categoryLabel}</span>
              ) : (
                <span>Business Directory</span>
              )}
            </h1>

            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              {searchQuery || categoryFilter
                ? `${pagination?.total ?? companies.length} companies found`
                : 'Discover verified businesses and professional services'
              }
            </p>

            {/* Minimal Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative ">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search companies..."
                  className="w-full pl-12 pr-24 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg shadow-sm"
                />
                {localSearch && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute  mr-8 right-16 top-1/2 transform -translate-y-1/2 text-gray-400 bg-white hover:text-gray-600 transition-colors duration-200"
                  >
                    <X className="h-5 w-5 " />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </form>

            {(searchQuery || categoryFilter) && (
              <div className="mt-6 flex items-center justify-center gap-3">
                {categoryFilter && (
                  <button
                    onClick={clearCategory}
                    className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200"
                  >
                    <X className="h-4 w-4 mr-1" />
                    {categoryLabel}
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="inline-flex items-center px-3 py-1 text-sm bg-red-200 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear search
                  </button>
                )}
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
                {searchQuery || categoryFilter
                  ? 'Try adjusting your search terms or browse all companies'
                  : 'Be the first to add your company to our directory!'
                }
              </p>
              {(searchQuery || categoryFilter) && (
                <button
                  onClick={clearAllFilters}
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
                    {searchQuery || categoryFilter ? 'Search Results' : 'All Companies'}
                  </h2>
                  <p className="text-gray-600">
                    {pagination ? (
                      <>Showing {pagination.from || 1}-{pagination.to || companies.length} of {pagination.total} companies</>
                    ) : (
                      <>Showing {companies.length} {companies.length === 1 ? 'company' : 'companies'}</>
                    )}
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

              {/* Pagination Controls */}
              <PaginationControls />
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default CompaniesPage
