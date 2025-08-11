import { useAuth } from '../contexts/AuthContext'
import UserDashboard from '../components/dashboards/UserDashboard'
import OwnerDashboard from '../components/dashboards/OwnerDashboard'
import AdminDashboard from '../components/dashboards/AdminDashboard'
import { Navigate } from 'react-router-dom'

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case 'superAdmin':
        return <AdminDashboard />
      case 'owner':
        return <OwnerDashboard />
      case 'user':
        return <UserDashboard />
      default:
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h2 className="text-lg font-medium text-red-800">Access Error</h2>
              <p className="text-red-600">Unknown user role. Please contact support.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderDashboard()}
    </div>
  )
}

export default DashboardPage
