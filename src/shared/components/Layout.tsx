
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/AuthContext'
import { useNavigation } from '../hooks/NavigationContext'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { LogOut, User, Mail, Settings, ChevronDown, Menu, X } from 'lucide-react'
import Avatar from 'react-avatar'
import logoImg from '/logo.svg'
import textLogo from '/logo with text.svg'
import { useState, useEffect } from 'react'
 
const Layout = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { navItems, activeTab, setActiveTab } = useNavigation()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Handle responsive detection
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // Close sidebar when screen becomes desktop
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false)
    }
  }, [isMobile])

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false)
      }
    }

    if (isSidebarOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isSidebarOpen])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsSidebarOpen(false) // Close sidebar after logout
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand with Mobile Menu */}
            <div className="flex items-center space-x-3">
              {/* Mobile Hamburger Menu */}
              {isMobile && isAuthenticated && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
              
              <div className="flex-shrink-0 flex items-center space-x-2">
                <img src={logoImg} alt="Festie Logo" className='w-5' />
                <img src={textLogo} alt="Festie Text Logo" className='w-24' />
              </div>
            </div>
            
            {/* Navigation Links - Hidden on Mobile */}
            <div className={`flex items-center space-x-8 ${isMobile ? 'hidden' : ''}`}>
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
                    to="/login" 
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 opacity-50 z-50 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <div className={`fixed top-0 left-0 h-full w-64 max-w-[80vw] bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <img src={logoImg} alt="Festie Logo" className='w-5' />
              <img src={textLogo} alt="Festie Text Logo" className='w-20' />
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded hover:bg-gray-100"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
            {navItems.length > 0 ? (
              navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsSidebarOpen(false)
                  }}
                  className={`w-full flex items-center px-3 py-3 rounded text-left text-sm transition-colors cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-transparent text-yellow-600 border border-yellow-400'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  <item.icon className={`h-4 w-4 mr-3 flex-shrink-0 ${
                    activeTab === item.id ? 'text-yellow-600' : 'text-gray-500'
                  }`} />
                  <span className="flex-1">{item.name}</span>
                </button>
              ))
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">
                Navigate to a page to see menu items
              </div>
            )}
          </div>

          {/* Sidebar Footer - Single line with user info and logout - ALWAYS AT BOTTOM */}
          {isAuthenticated && (
            <div className="border-t border-gray-200 bg-gray-50 p-3 flex-shrink-0 mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <Avatar 
                    name={user?.name || user?.email || 'User'} 
                    size="24" 
                    round={true}
                    color="#6b7280"
                    fgColor="#ffffff"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-2 py-1 rounded text-xs text-red-600 hover:bg-red-50 flex-shrink-0"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>

    </div>
  )
}

export default Layout