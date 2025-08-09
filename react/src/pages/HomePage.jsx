import { Search, Building2, Users, TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const stats = [
    { label: 'Companies Listed', value: '6+', icon: Building2 },
    { label: 'Services Available', value: '18+', icon: TrendingUp },
    { label: 'Active Users', value: '100+', icon: Users },
  ]

  const categories = [
    { name: 'Technology', count: 1, color: 'bg-blue-500' },
    { name: 'Consulting', count: 1, color: 'bg-green-500' },
    { name: 'Marketing', count: 1, color: 'bg-purple-500' },
    { name: 'Healthcare', count: 1, color: 'bg-red-500' },
    { name: 'Architecture', count: 1, color: 'bg-yellow-500' },
    { name: 'Food & Catering', count: 1, color: 'bg-orange-500' },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to companies page with search query
      window.location.href = `/companies?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find the Perfect
              <span className="block text-primary-200">Business for You</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Discover local businesses, services, and products in your area. 
              Connect with trusted companies and grow your network.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for companies, services, or products..."
                  className="w-full pl-12 pr-32 py-4 text-gray-900 bg-white rounded-xl focus:ring-4 focus:ring-primary-300 focus:outline-none text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="card text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore businesses organized by industry and find exactly what you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/companies?category=${encodeURIComponent(category.name.toLowerCase())}`}
              className="card hover:shadow-lg transition-shadow duration-200 text-center group"
            >
              <div className={`w-12 h-12 ${category.color} rounded-lg mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}></div>
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.count} companies</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Explore?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of users who trust our platform to find the best businesses 
                and services in their area. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/companies" className="btn-primary inline-flex items-center justify-center">
                  Browse Companies
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link to="/register" className="btn-secondary inline-flex items-center justify-center">
                  List Your Business
                </Link>
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-64 h-64 bg-primary-100 rounded-full">
                <Building2 className="h-32 w-32 text-primary-600" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
