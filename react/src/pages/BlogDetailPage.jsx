import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { blogService, commentService } from '../services/blogService'
import { useAuth } from '../contexts/AuthContext'
import {
  Calendar,
  User,
  MessageCircle,
  ArrowLeft,
  Loader2,
  Send,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
} from 'lucide-react'
import { useState } from 'react'
import BlogImagePlaceholder from '../components/blog/BlogImagePlaceholder'
import { getBlogSourceName } from '../utils/blogSource'

const CommentForm = ({ blogId, onSuccess }) => {
  const { isAuthenticated } = useAuth()
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const mutation = useMutation({
    mutationFn: (commentData) => commentService.addComment(blogId, commentData),
    onSuccess: () => {
      setComment('')
      setIsSubmitting(false)
      onSuccess()
    },
    onError: (error) => {
      console.error('Error adding comment:', error)
      setIsSubmitting(false)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    setIsSubmitting(true)
    mutation.mutate({ content: comment.trim() })
  }

  if (!isAuthenticated) {
    return (
      <div className="card bg-gray-50 border-gray-200 text-center py-8">
        <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Join the conversation
        </h3>
        <p className="text-gray-600 mb-4">
          Sign in to leave a comment and engage with other readers
        </p>
        <Link to="/login" className="btn-primary">
          Sign In to Comment
        </Link>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave a Comment</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-vertical"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Posting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

const CommentItem = ({ comment, onCommentUpdate }) => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)

  const isOwner = user && user.id === comment.user_id

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const updateMutation = useMutation({
    mutationFn: (data) => commentService.updateComment(comment.id, data),
    onSuccess: () => {
      setIsEditing(false)
      onCommentUpdate()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: () => commentService.deleteComment(comment.id),
    onSuccess: onCommentUpdate
  })

  const handleEdit = () => {
    updateMutation.mutate({ content: editContent })
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteMutation.mutate()
    }
  }

  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {comment.user?.first_name || comment.user?.last_name 
                ? `${comment.user?.first_name || ''} ${comment.user?.last_name || ''}`.trim()
                : 'Anonymous'
              }
            </p>
            <p className="text-sm text-gray-500">{formatDate(comment.created_at)}</p>
          </div>
        </div>
        {isOwner && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-400 bg-white hover:text-gray-600 p-1"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 bg-white hover:text-red-600 p-1"
              disabled={deleteMutation.isLoading}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              disabled={updateMutation.isLoading}
              className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 disabled:opacity-50"
            >
              {updateMutation.isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setEditContent(comment.content)
              }}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
      )}
    </div>
  )
}

const BlogDetailPage = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const { data: blogData, isLoading, error } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getBlog(id),
    enabled: !!id,
  })

  const { data: commentsData } = useQuery({
    queryKey: ['blog-comments', id],
    queryFn: () => commentService.getBlogComments(id),
    enabled: !!id,
    onSuccess: (data) => {
      console.log('Comments data received:', data)
    },
    onError: (error) => {
      console.error('Error fetching comments:', error)
    }
  })

  const handleCommentUpdate = () => {
    queryClient.invalidateQueries(['blog-comments', id])
    queryClient.invalidateQueries(['blog', id])
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading article...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error.message || 'The article you are looking for could not be found.'}
          </p>
          <Link to="/blogs" className="btn-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Link>
        </div>
      </div>
    )
  }

  const blog = blogData?.blog
  const comments = commentsData?.comments || []

  console.log('Blog ID:', id)
  console.log('Comments data:', commentsData)
  console.log('Comments array:', comments)
  console.log('Comments length:', comments.length)

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <Link to="/blogs" className="btn-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          to="/blogs" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Articles
        </Link>
      </div>

      {/* Blog Content */}
      <article className="card mb-8">
        {/* Blog Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>
          
          {/* Blog Meta */}
          <div className="flex items-center space-x-6 text-gray-500 mb-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              {formatDate(blog.created_at)}
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Admin
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              {comments.length} comments
            </div>
            <div className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              {blog.views || 0} views
            </div>
          </div>

          {/* Blog Status */}
          {blog.status && (
            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
              blog.status === 'published' 
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {blog.status}
            </span>
          )}
        </div>

        {/* Blog Image */}
        <div className="mb-8">
          {blog.image ? (
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-64 lg:h-96 object-cover rounded-lg"
            />
          ) : (
            <BlogImagePlaceholder blog={blog} className="w-full h-64 lg:h-96 rounded-lg" />
          )}
        </div>

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {/* Continue Reading CTA (imported posts only) */}
        {blog.external_source_url && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">This is a summary</p>
              <p className="text-gray-900 font-semibold">
                Read the full article on {getBlogSourceName(blog.external_source_url)}
              </p>
            </div>
            <a
              href={blog.external_source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            >
              Continue reading on {getBlogSourceName(blog.external_source_url)}
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </div>
        )}
      </article>

      {/* Comments Section */}
      <div className="space-y-8">
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          <CommentForm blogId={id} onSuccess={handleCommentUpdate} />

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-6 mt-8">
              {comments.map((comment) => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  onCommentUpdate={handleCommentUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No comments yet
              </h3>
              <p className="text-gray-600">
                Be the first to share your thoughts on this article!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogDetailPage
