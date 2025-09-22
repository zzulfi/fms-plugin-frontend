import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { LogOut, User, Mail, Settings, ChevronDown } from 'lucide-react'
import Avatar from 'react-avatar'
import logoImg from '/image.png'
import textLogo from '/logo.png'
 
const Layout = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0 flex items-center space-x-2">
              <img src={logoImg} alt="Festie Logo" className='w-5' />
              <img src={textLogo} alt="Festie Text Logo" className='w-24' />
            </div>
            
            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              {isAuthenticated ? (
                <>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <Avatar 
                          name={user?.name || user?.email || 'User'} 
                          size="36" 
                          round={true}
                          color="#3b82f6"
                          fgColor="#ffffff"
                          className="cursor-pointer"
                        />
                        <div className="hidden sm:block text-left">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user?.role || 'Member'}
                          </p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="space-y-4">
                        {/* User Info Header */}
                        <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                          <Avatar 
                            name={user?.name || user?.email || 'User'} 
                            size="48" 
                            round={true}
                            color="#3b82f6"
                            fgColor="#ffffff"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {user?.name || 'User'}
                            </h3>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user?.email || 'user@example.com'}
                            </p>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                              {user?.role || 'Member'}
                            </span>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-1">
                          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Profile</span>
                          </button>
                          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left">
                            <Settings className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Settings</span>
                          </button>
                        </div>

                        {/* Logout Button */}
                        <div className="pt-3 border-t border-gray-200">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-left group"
                          >
                            <LogOut className="h-4 w-4 text-red-500 group-hover:text-red-600" />
                            <span className="text-sm text-red-600 group-hover:text-red-700 font-medium">
                              Sign out
                            </span>
                          </button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </>
              ) : (
                <>
                  <Link 
                    to="/" 
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Home
                  </Link>
                  <Link 
                    to="/login" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2025 FMS Plugin. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout