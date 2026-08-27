import { useState, useEffect } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { blogService } from '../../services/blogService'
import { useAuth } from '../../contexts/AuthContext'
import {
  Loader2,
  ArrowLeft,
  AlertCircle,
  Save,
  Image as ImageIcon
} from 'lucide-react'

const BlogFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  const { user, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({ title: '', content: '', image: '' })
  const [errors, setErrors] = useState({})

  const { data: blogData, isLoading: isLoadingBlog } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getBlog(id),
    enabled: isEditing
  })

  useEffect(() => {
    if (blogData?.blog) {
      setFormData({
        title: blogData.blog.title || '',
        content: blogData.blog.content || '',
        image: blogData.blog.image || ''
      })
    }
  }, [blogData])

  const mutation = useMutation({
    mutationFn: (data) => {
      return isEditing
        ? blogService.updateBlog(id, data)
        : blogService.createBlog(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] })
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      navigate('/admin/blogs')
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        console.error('Error saving blog:', error)
        alert('Failed to save blog post. Please try again.')
      }
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    mutation.mutate({
      title: formData.title.trim(),
      content: formData.content.trim(),
      image: formData.image.trim() || null
    })
  }

  const fieldError = (name) => {
    const err = errors[name]
    return Array.isArray(err) ? err[0] : err
  }

  if (isEditing && isLoadingBlog) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading post...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <button
          onClick={() => navigate('/admin/blogs')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Blog Management
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isEditing ? 'Edit Blog Post' : 'Write New Post'}
        </h1>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${fieldError('title') ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Enter a title for the post"
            />
            {fieldError('title') && (
              <p className="mt-1 text-sm text-red-600">{fieldError('title')}</p>
            )}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-vertical font-mono text-sm ${fieldError('content') ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Write the post content. Basic HTML (e.g. <p>, <b>) is supported."
            />
            {fieldError('content') && (
              <p className="mt-1 text-sm text-red-600">{fieldError('content')}</p>
            )}
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                ) : (
                  <ImageIcon className="h-8 w-8 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${fieldError('image') ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">Optional. Paste a link to an image hosted elsewhere.</p>
              </div>
            </div>
            {fieldError('image') && (
              <p className="mt-1 text-sm text-red-600">{fieldError('image')}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary flex items-center disabled:opacity-50"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isEditing ? 'Save Changes' : 'Publish Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/blogs')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BlogFormPage
