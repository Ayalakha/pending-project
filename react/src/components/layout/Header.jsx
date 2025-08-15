import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Building2, BookOpen, User, Menu, X, LogOut, Settings } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useClickOutside } from '../../hooks/useClickOutside'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Close user menu when clicking outside
  const userMenuRef = useClickOutside(() => setIsUserMenuOpen(false))

  const isActive = (path) => location.pathname === path

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/companies?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setIsMenuOpen(false) // Close mobile menu if open
    }
  }

  const handleLogout = async () => {
    await logout()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  const navigation = [
    { name: 'Home', href: '/', icon: null },
    { name: 'Companies', href: '/companies', icon: Building2 },
    { name: 'Blogs', href: '/blogs', icon: BookOpen },
  ]

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section - Left Aligned */}
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <Building2 className="relative h-10 w-10 text-blue-600 group-hover:text-indigo-600 transition-colors duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  BizDirectory
                </span>
                <span className="text-xs text-gray-500 font-medium tracking-wide">
                  Professional Network
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Now positioned after logo */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.name}</span>
                    {isActive(item.href) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className="hidden md:flex">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search companies..."
                  className="w-72 pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200/80 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-300"
                />
              </form>
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 px-4 py-2.5 rounded-xl hover:bg-blue-50/80 transition-all duration-300 bg-transparent border-0 outline-none group"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{user?.username}</span>
                      <span className="text-xs text-gray-500">{user?.role}</span>
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/60 py-2 z-10 overflow-hidden">
                      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50/80 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full mt-2">
                          {user?.role}
                        </span>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50/60 transition-all duration-200"
                        >
                          <User className="h-4 w-4 mr-3 text-gray-500" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50/60 transition-all duration-200"
                        >
                          <Settings className="h-4 w-4 mr-3 text-gray-500" />
                          Profile Settings
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50/60 transition-all duration-200 bg-transparent border-0 outline-none text-left"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 px-4 py-2.5 text-sm font-medium rounded-xl hover:bg-gray-50/80 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-300 text-sm shadow-sm hover:shadow-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 bg-transparent border-0 outline-none transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <div className="mb-6">
                <form onSubmit={handleSearch} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search companies..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200/80 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-300"
                  />
                </form>
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 ${
                        isActive(item.href)
                          ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                      }`}
                    >
                      {Icon && <Icon className="h-5 w-5" />}
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>

              {/* Mobile Auth */}
              <div className="pt-6 border-t border-gray-100 space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50/80 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                          <p className="text-xs text-gray-600">{user?.email}</p>
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full mt-1">
                            {user?.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-xl transition-all duration-300"
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      Profile Settings
                    </Link>
                    {user?.role === 'owner' && (
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-xl transition-all duration-300"
                      >
                        <Building2 className="h-5 w-5 mr-3" />
                        My Companies
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-3 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50/60 rounded-xl transition-all duration-300 bg-transparent border-0 outline-none text-left"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl transition-all duration-300"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block mx-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 text-center shadow-sm"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
