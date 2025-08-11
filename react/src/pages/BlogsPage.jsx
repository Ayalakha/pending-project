import { useQuery } from '@tanstack/react-query'
import { blogService } from '../services/blogService'
import { Calendar, User, MessageCircle, Loader2, Search, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const BlogCard = ({ blog }) => {
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
    <article className="card hover:shadow-lg transition-shadow duration-200">
      {/* Blog Image */}
      {blog.image && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}

      <div className="p-6">
        {/* Blog Meta */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(blog.created_at)}
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            Admin
          </div>
          {blog.comments_count > 0 && (
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              {blog.comments_count} comments
            </div>
          )}
        </div>

        {/* Blog Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          <Link 
            to={`/blogs/${blog.id}`}
            className="hover:text-primary-600 transition-colors"
          >
            {blog.title}
          </Link>
        </h2>

        {/* Blog Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {truncateContent(blog.content)}
        </p>

        {/* Blog Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {blog.status && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                blog.status === 'published' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {blog.status}
              </span>
            )}
          </div>
          <Link
            to={`/blogs/${blog.id}`}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            <Eye className="h-4 w-4 mr-1" />
            Read More
          </Link>
        </div>
      </div>
    </article>
  )
}

const BlogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getBlogs(),
  })

  const handleSearch = (e) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log('Search for:', searchQuery)
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading blogs...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Blogs</h1>
          <p className="text-gray-600">
            {error.message || 'Something went wrong. Please try again later.'}
          </p>
        </div>
      </div>
    )
  }

  const blogs = data?.blogs?.data || data?.blogs || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Latest Articles & Insights
        </h1>
        <p className="text-gray-600 mb-6">
          Discover valuable insights, industry trends, and expert advice
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Blogs Grid */}
      {blogs.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No articles found
          </h3>
          <p className="text-gray-600">
            Check back soon for new articles and insights!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}

      {/* Pagination placeholder */}
      {data?.blogs?.total > (data?.blogs?.per_page || 10) && (
        <div className="mt-12 flex justify-center">
          <div className="text-gray-600">
            {/* TODO: Implement pagination */}
            Pagination coming soon...
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogsPage
