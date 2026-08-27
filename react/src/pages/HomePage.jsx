import { Search, Building2, ArrowRight, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import { statsService } from '../services/statsService'
import { companyService } from '../services/companyService'
import StarRating from '../components/reviews/StarRating'

const CATEGORY_TINTS = ['bg-blue-50', 'bg-emerald-50', 'bg-purple-50', 'bg-rose-50', 'bg-amber-50', 'bg-orange-50']

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { isAuthenticated } = useAuth()

  const { data: statsData } = useQuery({
    queryKey: ['platformStats'],
    queryFn: () => statsService.getStats(),
    staleTime: 5 * 60 * 1000
  })

  const { data: recentData } = useQuery({
    queryKey: ['recentCompanies'],
    queryFn: () => companyService.getCompanies({ page: 1 }),
    staleTime: 5 * 60 * 1000
  })

  const recentCompanies = (recentData?.companies?.data || recentData?.companies || []).slice(0, 8)
  const logoWallSlots = recentCompanies.length > 0 ? recentCompanies.slice(0, 6) : Array.from({ length: 6 })

  const stats = [
    {
      label: 'Verified Companies',
      value: statsData?.stats?.verified_companies ?? '—',
      description: 'Thoroughly vetted businesses'
    },
    {
      label: 'Service Categories',
      value: statsData?.stats?.service_categories ?? '—',
      description: 'Diverse professional services'
    },
    {
      label: 'Registered Users',
      value: statsData?.stats?.users ?? '—',
      description: 'People using the directory'
    },
  ]

  const categories = [
    {
      name: 'Technology & IT',
      count: 2,
      description: 'Software development & IT consulting',
      icon: '💻'
    },
    {
      name: 'Professional Services',
      count: 2,
      description: 'Strategic planning & optimization',
      icon: '📊'
    },
    {
      name: 'Media & Entertainment',
      count: 1,
      description: 'Media production & entertainment',
      icon: '🎬'
    },
    {
      name: 'Healthcare & Wellness',
      count: 1,
      description: 'Medical & wellness services',
      icon: '🏥'
    },
    {
      name: 'Construction',
      count: 1,
      description: 'Building & construction services',
      icon: '🏗️'
    },
    {
      name: 'Food & Hospitality',
      count: 1,
      description: 'Catering & event planning',
      icon: '🍽️'
    },
  ]

  const howItWorks = [
    {
      icon: Search,
      tint: 'bg-blue-50',
      title: 'Search and filter',
      description: 'Look up a company by name, or filter the full list by category, sector, or location to narrow down what you need.'
    },
    {
      icon: CheckCircle,
      tint: 'bg-emerald-50',
      title: 'Verification',
      description: 'Listed businesses go through a review step before they appear as verified, so the directory reflects real, active companies.'
    },
    {
      icon: Building2,
      tint: 'bg-purple-50',
      title: 'Categories and sectors',
      description: 'Companies are grouped into categories covering technology, professional services, healthcare, construction, and more.'
    }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/companies?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3 space-y-6">
            <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Morocco Business Directory
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              A directory of Moroccan businesses
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              Search and browse companies by category, location, and sector.
            </p>

            <form onSubmit={handleSearch} className="max-w-xl">
              <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <Search className="ml-4 text-gray-400 h-5 w-5 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search companies, services, or industries..."
                  className="w-full px-3 py-3 text-gray-900 placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {statsData?.stats && (
              <p className="text-sm text-gray-500">
                {statsData.stats.verified_companies} businesses listed
              </p>
            )}
          </div>

          {/* Logo wall */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-blue-50/60 p-6">
              <div className="grid grid-cols-3 gap-3">
                {logoWallSlots.map((company, index) => (
                  <div
                    key={company?.id ?? index}
                    className="aspect-square bg-white rounded-xl border border-gray-200 flex items-center justify-center p-3"
                  >
                    {company?.logo ? (
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Figures Strip */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-gray-200 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="px-4">
                <div className="text-4xl md:text-5xl font-bold text-gray-900">{stat.value}</div>
                <div className="mt-2 text-sm font-semibold text-gray-800">{stat.label}</div>
                <div className="mt-1 text-sm text-gray-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
            How the directory works
          </h2>

          {howItWorks.map((row, index) => {
            const Icon = row.icon
            const reversed = index % 2 === 1
            return (
              <div key={index} className="grid md:grid-cols-2 gap-10 items-center">
                <div className={`${reversed ? 'md:order-2' : ''} rounded-2xl ${row.tint} p-12 flex items-center justify-center`}>
                  <Icon className="w-16 h-16 text-gray-700" strokeWidth={1.5} />
                </div>
                <div className={reversed ? 'md:order-1' : ''}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{row.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{row.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Categories</h2>
            <p className="mt-2 text-gray-600">Browse companies by category.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/companies?category=${encodeURIComponent(category.name.toLowerCase())}`}
                className={`group rounded-2xl p-8 ${CATEGORY_TINTS[index % CATEGORY_TINTS.length]} border border-transparent hover:border-gray-300 transition-colors`}
              >
                <div className="flex items-start gap-5">
                  <div className="text-4xl">{category.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                    <span className="text-sm text-gray-500">{category.count} companies</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Newest in the directory</h2>
              <p className="mt-2 text-gray-600">Recently added companies.</p>
            </div>
            <Link to="/companies" className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentCompanies.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentCompanies.map((company) => (
                <Link
                  key={company.id}
                  to={`/companies/${company.id}`}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-4 overflow-hidden">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{company.name}</h3>
                  {company.activity_sector && (
                    <p className="text-sm text-gray-500 mb-3">{company.activity_sector}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <StarRating rating={Math.round(company.average_rating || 0)} readOnly size="w-3.5 h-3.5" />
                    <span className="text-xs text-gray-500">({company.total_reviews || 0})</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No companies listed yet.</p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-blue-50/60 p-10">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Have a business in Morocco?</h3>
            <p className="text-gray-600 mb-6">Add it to the directory so people can find you.</p>
            <Link
              to={isAuthenticated ? "/companies/new" : "/register?redirect=/companies/new"}
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              {isAuthenticated ? "Add your company" : "List your business"}
            </Link>
          </div>
          <div className="rounded-2xl bg-gray-50 p-10">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Looking for a company?</h3>
            <p className="text-gray-600 mb-6">Browse by category or search above.</p>
            <Link
              to="/companies"
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-900 px-5 py-3 rounded-lg font-medium hover:bg-white transition-colors"
            >
              Browse companies
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
