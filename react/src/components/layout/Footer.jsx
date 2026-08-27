import { Mail, Phone, MapPin, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-sm opacity-20"></div>
                <img src="/logo/icon.png" alt="IndexMA" className="relative h-14 w-14" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  IndexMA
                </span>
                <span className="text-xs text-gray-400 font-medium tracking-wide">
                  Professional Network
                </span>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md text-sm leading-relaxed">
              Discover and connect with businesses in your area. Find the perfect 
              services and products for your needs with our comprehensive directory.
            </p>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-sm">contact@indexma.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition-all duration-300 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/companies" className="text-gray-300 hover:text-blue-400 transition-all duration-300 text-sm">
                  Companies
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-300 hover:text-blue-400 transition-all duration-300 text-sm">
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-blue-400 transition-all duration-300 text-sm">
                  Add Your Business
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-all duration-300 text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-all duration-300 text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-all duration-300 text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-all duration-300 text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 IndexMA. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400 fill-current" />
              <span>for businesses worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
