import { useQuery } from '@tanstack/react-query'
import { blogService } from '../services/blogService'
import { Calendar, User, MessageCircle, Loader2, Search, Eye, ArrowRight, BookOpen, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const BlogCard = ({ blog }) => {
  const authorName = [blog.author?.first_name, blog.author?.last_name].filter(Boolean).join(' ') || 'Unknown'

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return ''
    const textContent = content.replace(/<[^>]*>/g, '') // Remove HTML tags
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...'
      : textContent
  }

  return (
    <article className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Blog Image */}
      {blog.image && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-8">
        {/* Blog Meta */}
        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
          <div className="flex items-center bg-gray-50 rounded-full px-3 py-1">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            {formatDate(blog.created_at)}
          </div>
          <div className="flex items-center bg-gray-50 rounded-full px-3 py-1">
            <User className="h-4 w-4 mr-2 text-emerald-500" />
            {authorName}
          </div>
          {blog.comments_count > 0 && (
            <div className="flex items-center bg-gray-50 rounded-full px-3 py-1">
              <MessageCircle className="h-4 w-4 mr-2 text-purple-500" />
              {blog.comments_count}
            </div>
          )}
        </div>

        {/* Blog Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          <Link 
            to={`/blogs/${blog.id}`}
          >
            {blog.title}
          </Link>
        </h2>

        {/* Blog Excerpt */}
        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
          {truncateContent(blog.content)}
        </p>

        {/* Blog Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {blog.status && (
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                blog.status === 'approved'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {blog.status}
              </span>
            )}
          </div>
          <Link
            to={`/blogs/${blog.id}`}
            className="group/btn inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105"
          >
            <span>Read More</span>
            <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </article>
  )
}

const BlogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSearch, setActiveSearch] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs', activeSearch],
    queryFn: () => activeSearch
      ? blogService.searchBlogs(activeSearch)
      : blogService.getBlogs(),
  })

  const handleSearch = (e) => {
    e.preventDefault()
    setActiveSearch(searchQuery.trim())
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Articles</h2>
            <p className="text-gray-600">Fetching the latest insights and stories...</p>
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
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Unable to Load Articles</h1>
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

  const blogs = data?.blogs?.data || data?.blogs || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Header Section */}
      <section className="relative bg-gradient-to-b from-white to-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            {/* Simple Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-8">
              <BookOpen className="w-4 h-4" />
              <span>{blogs.length} Articles</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Latest Articles & Insights
            </h1>
            
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Discover valuable insights, industry trends, and expert advice from our team
            </p>

            {/* Minimal Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-24 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {blogs.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                No Articles Found
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                Check back soon for new articles and insights!
              </p>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Featured Articles
                </h2>
                <p className="text-gray-600">
                  Showing {blogs.length} {blogs.length === 1 ? 'article' : 'articles'}
                </p>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Pagination Section */}
      {data?.blogs?.total > (data?.blogs?.per_page || 10) && (
        <section className="py-16 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-xl">
                <Clock className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600 font-medium">Pagination coming soon...</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default BlogsPage
