import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blogService } from '../../services/blogService'
import { useAuth } from '../../contexts/AuthContext'
import { Link, Navigate } from 'react-router-dom'
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const statusBadge = (status) => {
  const styles = {
    approved: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800'
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status || 'unknown'}
    </span>
  )
}

const BlogRow = ({ blog, onDelete, isDeleting }) => {
  const authorName = [blog.author?.first_name, blog.author?.last_name].filter(Boolean).join(' ') || 'Unknown'
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900 max-w-md truncate">{blog.title}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{authorName}</td>
      <td className="px-6 py-4 whitespace-nowrap">{statusBadge(blog.status)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(blog.created_at)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <Link
            to={`/admin/blogs/${blog.id}/edit`}
            className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onDelete(blog)}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            title="Delete"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </button>
        </div>
      </td>
    </tr>
  )
}

const BlogManagementPage = () => {
  const { user, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminBlogs', page],
    queryFn: () => blogService.getBlogs({ page }),
    keepPreviousData: true
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => blogService.deleteBlog(id),
    onMutate: (id) => setDeletingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] })
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      setDeletingId(null)
    },
    onError: () => {
      alert('Failed to delete blog post. Please try again.')
      setDeletingId(null)
    }
  })

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'superAdmin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">Only super admins can manage blog posts.</p>
        </div>
      </div>
    )
  }

  const pagination = data?.blogs
  const blogs = pagination?.data || []

  const handleDelete = (blog) => {
    if (window.confirm(`Delete "${blog.title}"? This action cannot be undone.`)) {
      deleteMutation.mutate(blog.id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-600 mt-2">Write, edit, and remove blog posts</p>
          </div>
          <Link to="/admin/blogs/new" className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Write New Post
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading posts...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-red-800 mb-2">Error Loading Posts</h2>
            <p className="text-red-600">Failed to load blog posts. Please try again later.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Posts {pagination?.total ? `(${pagination.total})` : ''}
              </h2>
            </div>

            {blogs.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {blogs.map((blog) => (
                        <BlogRow
                          key={blog.id}
                          blog={blog}
                          onDelete={handleDelete}
                          isDeleting={deletingId === blog.id}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {pagination && pagination.last_page > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={!pagination.prev_page_url}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={!pagination.next_page_url}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Blog Posts Yet</h3>
                <p className="text-gray-600 mb-6">Write your first post to get started.</p>
                <Link to="/admin/blogs/new" className="btn-primary inline-flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Write New Post
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogManagementPage
