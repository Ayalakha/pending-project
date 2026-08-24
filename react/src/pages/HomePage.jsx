import { Search, Building2, Users, TrendingUp, ArrowRight, Shield, Star, CheckCircle, Globe, Target, Award, Briefcase, Coffee, HeartHandshake, Clock, MapPin, Zap, Users2, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import { statsService } from '../services/statsService'

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { user, isAuthenticated } = useAuth()

  const { data: statsData } = useQuery({
    queryKey: ['platformStats'],
    queryFn: () => statsService.getStats(),
    staleTime: 5 * 60 * 1000
  })

  const stats = [
    {
      label: 'Verified Companies',
      value: statsData?.stats?.verified_companies ?? '—',
      icon: Building2,
      description: 'Thoroughly vetted businesses'
    },
    {
      label: 'Service Categories',
      value: statsData?.stats?.service_categories ?? '—',
      icon: TrendingUp,
      description: 'Diverse professional services'
    },
    {
      label: 'Satisfied Users',
      value: statsData?.stats?.users ?? '—',
      icon: Users,
      description: 'Growing trusted community'
    },
  ]

  const categories = [
    {
      name: 'Technology & IT',
      count: 2,
      color: 'from-blue-500 to-indigo-600',
      description: 'Software development & IT consulting',
      icon: '💻'
    },
    {
      name: 'Business Consulting',
      count: 2,
      color: 'from-emerald-500 to-teal-600',
      description: 'Strategic planning & optimization',
      icon: '📊'
    },
    {
      name: 'Marketing & Advertising',
      count: 1,
      color: 'from-purple-500 to-violet-600',
      description: 'Digital marketing & branding',
      icon: '📈'
    },
    {
      name: 'Healthcare & Wellness',
      count: 1,
      color: 'from-rose-500 to-pink-600',
      description: 'Medical & wellness services',
      icon: '🏥'
    },
    {
      name: 'Architecture & Design',
      count: 1,
      color: 'from-amber-500 to-orange-600',
      description: 'Architectural & design services',
      icon: '🏗️'
    },
    {
      name: 'Food & Hospitality',
      count: 1,
      color: 'from-orange-500 to-red-600',
      description: 'Catering & event planning',
      icon: '🍽️'
    },
  ]

  const features = [
    {
      icon: Shield,
      title: 'Verified & Trusted',
      description: 'Every business undergoes rigorous verification processes ensuring authenticity and professional standards.',
      highlight: 'background checks'
    },
    {
      icon: Zap,
      title: 'Instant Connections',
      description: 'Advanced matching algorithm connects you with the perfect business partners in seconds.',
      highlight: 'smart algorithms'
    },
    {
      icon: Users2,
      title: 'Expert Support',
      description: 'Dedicated team of professionals ready to assist you in finding the right business partnerships.',
      highlight: '24/7 assistance'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CEO, TechStart Solutions',
      content: 'This platform revolutionized how we find reliable service providers. The verification process gives us complete confidence.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Marketing Director',
      content: 'Exceptional quality businesses. We\'ve saved countless hours and found partners that truly understand our needs.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Emily Thompson',
      role: 'Operations Manager',
      content: 'Outstanding platform! Detailed profiles and reviews helped us make informed decisions and build lasting partnerships.',
      rating: 5,
      avatar: '👩‍🚀'
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
      <section className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_70%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.05),transparent_70%)]"></div>
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-sm font-medium">
              <Trophy className="w-4 h-4" />
              <span>
                {statsData?.stats
                  ? `Trusted by ${statsData.stats.verified_companies} Verified Businesses`
                  : 'A Trusted Business Directory'}
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="block bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                  Find Your Perfect
                </span>
                <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Business Partner
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Connect with verified professionals who transform your vision into reality.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2">
                  <div className="flex items-center">
                    <div className="flex-1 relative">
                      <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search companies, services, or industries..."
                        className="w-full pl-14 pr-6 py-4 bg-transparent text-white placeholder-white/60 text-lg focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                    >
                      <span>Search</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400 pt-8">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">100% Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm">Secure Platform</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span className="text-sm">Global Network</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by <span className="text-blue-600">Industry Leaders</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of businesses that have found their perfect partners through our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="group text-center">
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-5xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-xl font-semibold text-gray-800 mb-2">{stat.label}</div>
                    <p className="text-gray-600">{stat.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-blue-600">BizDirectory?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive solutions that streamline business discovery and partnership formation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="group text-center">
                  <div className="bg-gray-50/50 rounded-3xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {feature.highlight}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore <span className="text-blue-600">Categories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse through our carefully curated business categories, each featuring verified professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/companies?category=${encodeURIComponent(category.name.toLowerCase())}`}
                className="group relative bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className={`w-14 h-14 bg-gradient-to-r ${category.color} rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                  <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                    <Building2 className="w-3 h-3 mr-1" />
                    {category.count} Companies
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Our <span className="text-blue-400">Partners Say</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Hear from industry leaders who have transformed their business relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center mb-6">
                  {Array.from({ length: testimonial.rating }, (_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <blockquote className="text-gray-200 mb-6 italic">
                  "{testimonial.content}"
                </blockquote>

                <div className="flex items-center">
                  <div className="text-2xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-blue-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium mb-8">
            <Briefcase className="w-4 h-4" />
            <span>Join Our Network</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Find Your
            <span className="block text-blue-100">Perfect Partner?</span>
          </h2>

          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Join our exclusive network of verified professionals and start building meaningful business relationships today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/companies"
              className="group bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <span>Explore Businesses</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to={isAuthenticated ? "/companies/new" : "/register?redirect=/companies/new"}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <Building2 className="w-5 h-5" />
              <span>{isAuthenticated ? "Add Your Company" : "List Your Business"}</span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-blue-200">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Verified Reviews</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span className="text-sm">Global Coverage</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
