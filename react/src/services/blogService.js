import api from './api'

export const blogService = {
  // Get all blogs with pagination
  getBlogs: async (params = {}) => {
    const response = await api.get('/blogs', { params })
    return response.data
  },

  // Get single blog by ID
  getBlog: async (id) => {
    const response = await api.get(`/blogs/${id}`)
    return response.data
  },

  // Create new blog (SuperAdmin only)
  createBlog: async (blogData) => {
    const response = await api.post('/blogs', blogData)
    return response.data
  },

  // Update blog (SuperAdmin only)
  updateBlog: async (id, blogData) => {
    const response = await api.put(`/blogs/${id}`, blogData)
    return response.data
  },

  // Delete blog (SuperAdmin only)
  deleteBlog: async (id) => {
    const response = await api.delete(`/blogs/${id}`)
    return response.data
  },

  // Search blogs
  searchBlogs: async (query) => {
    const response = await api.get('/blogs/search', { params: { q: query } })
    return response.data
  }
}

export const commentService = {
  // Get comments for a blog
  getBlogComments: async (blogId) => {
    const response = await api.get(`/blogs/${blogId}/comments`)
    return response.data
  },

  // Add comment to blog (authenticated users)
  addComment: async (blogId, commentData) => {
    const response = await api.post(`/blogs/${blogId}/comments`, commentData)
    return response.data
  },

  // Update comment (own comments only)
  updateComment: async (commentId, commentData) => {
    const response = await api.put(`/comments/${commentId}`, commentData)
    return response.data
  },

  // Delete comment (own comments only)
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`)
    return response.data
  }
}
