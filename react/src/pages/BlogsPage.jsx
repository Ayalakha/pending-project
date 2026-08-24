import { useQuery } from '@tanstack/react-query'
import { blogService } from '../services/blogService'
import { Calendar, User, MessageCircle, Loader2, Search, Eye, ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

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
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const activeSearch = searchParams.get('search') || ''
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1)

  useEffect(() => {
    setSearchQuery(activeSearch)
    setCurrentPage(parseInt(searchParams.get('page')) || 1)
  }, [activeSearch, searchParams])

  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs', activeSearch, currentPage],
    queryFn: () => {
      const params = currentPage > 1 ? { page: currentPage } : {}
      return activeSearch
        ? blogService.searchBlogs(activeSearch, params)
        : blogService.getBlogs(params)
    },
  })

  const handleSearch = (e) => {
    e.preventDefault()
    const newParams = new URLSearchParams()
    if (searchQuery.trim()) newParams.set('search', searchQuery.trim())
    setSearchParams(newParams)
  }

  const handlePageChange = (page) => {
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
  const pagination = data?.blogs?.current_page ? data.blogs : null

  const PaginationControls = () => {
    if (!pagination || !pagination.last_page || pagination.last_page <= 1) return null

    const page = pagination.current_page
    const lastPage = pagination.last_page
    const hasNext = pagination.next_page_url
    const hasPrev = pagination.prev_page_url

    return (
      <div className="flex items-center justify-center space-x-2 mt-12">
        <button
          onClick={() => handlePageChange(page - 1)}
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

        <div className="flex items-center space-x-1">
          {page > 2 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="w-10 h-10 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                1
              </button>
              {page > 3 && <span className="text-gray-400 px-2">...</span>}
            </>
          )}

          {page > 1 && (
            <button
              onClick={() => handlePageChange(page - 1)}
              className="w-10 h-10 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              {page - 1}
            </button>
          )}

          <button
            className="w-10 h-10 rounded-lg font-medium bg-blue-600 text-white"
            disabled
          >
            {page}
          </button>

          {page < lastPage && (
            <button
              onClick={() => handlePageChange(page + 1)}
              className="w-10 h-10 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              {page + 1}
            </button>
          )}

          {page < lastPage - 1 && (
            <>
              {page < lastPage - 2 && <span className="text-gray-400 px-2">...</span>}
              <button
                onClick={() => handlePageChange(lastPage)}
                className="w-10 h-10 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                {lastPage}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => handlePageChange(page + 1)}
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
              <BookOpen className="w-4 h-4" />
              <span>{pagination?.total ?? blogs.length} Articles</span>
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
                  Showing {blogs.length} of {pagination?.total ?? blogs.length} {(pagination?.total ?? blogs.length) === 1 ? 'article' : 'articles'}
                </p>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>

              <PaginationControls />
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default BlogsPage
