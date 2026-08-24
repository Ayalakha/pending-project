import { useAuth } from '../../contexts/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { commentService } from '../../services/blogService'
import { 
  User, 
  MessageCircle, 
  Calendar,
  Settings,
  BookOpen
} from 'lucide-react'
import { Link } from 'react-router-dom'

const UserDashboard = () => {
  const { user } = useAuth()

  // Fetch user's comments
  const { data: userComments = [], isLoading } = useQuery({
    queryKey: ['userComments'],
    queryFn: async () => {
      // We'll need to create an endpoint for user's comments
      // For now, return empty array
      return []
    }
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.first_name}!
            </h1>
            <p className="text-gray-600">
              Member since {formatDate(user?.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Comments</p>
              <p className="text-2xl font-semibold text-gray-900">{userComments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Articles Read</p>
              <p className="text-2xl font-semibold text-gray-900">-</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Days</p>
              <p className="text-2xl font-semibold text-gray-900">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Comments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Comments</h2>
          {isLoading ? (
            <p className="text-gray-500">Loading comments...</p>
          ) : userComments.length > 0 ? (
            <div className="space-y-4">
              {userComments.slice(0, 5).map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <p className="text-sm text-gray-600 mb-1">
                    On: <span className="font-medium">{comment.blog?.title}</span>
                  </p>
                  <p className="text-gray-800 line-clamp-2">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(comment.created_at)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No comments yet</p>
              <Link to="/blogs" className="text-primary-600 hover:text-primary-500 text-sm">
                Start reading and commenting →
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link 
              to="/blogs" 
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Browse Articles</p>
                  <p className="text-sm text-gray-600">Discover new content</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/profile" 
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Edit Profile</p>
                  <p className="text-sm text-gray-600">Update your information</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
