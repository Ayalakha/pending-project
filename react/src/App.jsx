import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import CompaniesPage from './pages/CompaniesPage'
import CompanyDetailPage from './pages/CompanyDetailPage'
import MyCompaniesPage from './pages/MyCompaniesPage'
import CompanyFormPage from './pages/CompanyFormPage'
import ManageServicesPage from './pages/ManageServicesPage'
import BlogsPage from './pages/BlogsPage'
import BlogDetailPage from './pages/BlogDetailPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import UserManagementPage from './pages/admin/UserManagementPage'
import CompanyModerationPage from './pages/admin/CompanyModerationPage'
import BlogManagementPage from './pages/admin/BlogManagementPage'
import BlogFormPage from './pages/admin/BlogFormPage'
import ContentModerationPage from './components/admin/ContentModerationPage'
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard'
import OwnerAnalytics from './pages/owner/OwnerAnalytics'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
)

// Main app content
const AppContent = () => {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/companies/:id" element={<CompanyDetailPage />} />
            <Route path="/my-companies" element={<MyCompaniesPage />} />
            <Route path="/companies/new" element={<CompanyFormPage />} />
            <Route path="/companies/:id/edit" element={<CompanyFormPage />} />
            <Route path="/companies/:id/manage-items" element={<ManageServicesPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/:id" element={<BlogDetailPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/companies" element={<CompanyModerationPage />} />
            <Route path="/admin/content-moderation" element={<ContentModerationPage />} />
            <Route path="/admin/blogs" element={<BlogManagementPage />} />
            <Route path="/admin/blogs/new" element={<BlogFormPage />} />
            <Route path="/admin/blogs/:id/edit" element={<BlogFormPage />} />
            <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
            <Route path="/owner/analytics" element={<OwnerAnalytics />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App