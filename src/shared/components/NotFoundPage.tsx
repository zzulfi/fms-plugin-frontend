import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { ArrowLeft, Home } from 'lucide-react'
import logoImg from '/logo.svg'

export function NotFoundPage() {
  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1)
  }

  const goHome = () => {
    navigate('/')
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-lg w-full text-center relative z-10 py-8">
        {/* Logo */}
        <div className="mb-6">
          <div className="relative">
            <img 
              src={logoImg} 
              alt="FMS Logo" 
              className="h-14 w-14 mx-auto mb-3 animate-bounce"
            />
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 to-blue-400/20 rounded-full blur-md"></div>
          </div>
        </div>

        {/* 404 Large Text */}
        <div className="mb-6 relative">
          <h1 className="text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 animate-pulse relative z-10">
            404
          </h1>
          <div className="absolute inset-0 text-6xl lg:text-7xl font-bold text-yellow-300/20 blur-sm">
            404
          </div>
          <div className="text-lg text-gray-600 mt-2 font-medium flex items-center justify-center gap-2">
            <span className="animate-pulse">🔍</span>
            Page Not Found
            <span className="animate-pulse delay-500">💫</span>
          </div>
        </div>

        {/* Main Message */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Oops! We can't find that page
          </h2>
        </div>

        {/* Quick Navigation Cards */}
        <div className="mb-6 grid grid-cols-3 gap-2">
          <div 
            onClick={() => navigate('/admin')}
            className="p-3 bg-yellow-100/80 backdrop-blur-sm rounded-lg border border-yellow-200 hover:bg-yellow-200/80 transition-all duration-200 cursor-pointer group"
          >
            <div className="text-yellow-600 text-xs font-medium mb-1">Admin</div>
            <div className="text-yellow-800 text-sm font-semibold group-hover:scale-105 transition-transform">Dashboard</div>
          </div>
          <div 
            onClick={() => navigate('/team')}
            className="p-3 bg-blue-100/80 backdrop-blur-sm rounded-lg border border-blue-200 hover:bg-blue-200/80 transition-all duration-200 cursor-pointer group"
          >
            <div className="text-blue-600 text-xs font-medium mb-1">Team</div>
            <div className="text-blue-800 text-sm font-semibold group-hover:scale-105 transition-transform">Manager</div>
          </div>
          <div 
            onClick={() => navigate('/login')}
            className="p-3 bg-green-100/80 backdrop-blur-sm rounded-lg border border-green-200 hover:bg-green-200/80 transition-all duration-200 cursor-pointer group"
          >
            <div className="text-green-600 text-xs font-medium mb-1">User</div>
            <div className="text-green-800 text-sm font-semibold group-hover:scale-105 transition-transform">Login</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Button
            onClick={goBack}
            variant="outline"
            className="flex items-center justify-center gap-2 h-11 px-6 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>
          
          <Button
            onClick={goHome}
            className="group flex items-center justify-center gap-2 h-11 px-6 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Home className="h-4 w-4 transition-transform group-hover:scale-110" />
            Go Home
          </Button>
        </div>

        {/* Fun Interactive Status */}
        <div className="text-sm text-gray-600 bg-white/40 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
          <span className="inline-flex items-center gap-2">
            <span className="animate-spin text-base">🧭</span>
            <span>Lost in the digital maze?</span>
            <span className="animate-bounce">🏠</span>
          </span>
        </div>
      </div>

      {/* Floating elements for decoration */}
      <div className="absolute top-20 left-20 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-60">
        <div className="absolute inset-0 bg-yellow-300 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute bottom-32 right-32 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-60 delay-700">
        <div className="absolute inset-0 bg-blue-300 rounded-full animate-bounce delay-300"></div>
      </div>
      <div className="absolute top-1/3 right-20 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-60 delay-1000">
        <div className="absolute inset-0 bg-purple-300 rounded-full animate-pulse delay-500"></div>
      </div>
      <div className="absolute bottom-20 left-1/3 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-60 delay-300">
        <div className="absolute inset-0 bg-green-300 rounded-full animate-bounce delay-700"></div>
      </div>
      
      {/* Additional floating shapes */}
      <div className="absolute top-1/4 left-1/4 w-1 h-8 bg-gradient-to-b from-yellow-400 to-transparent rounded opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-8 h-1 bg-gradient-to-r from-blue-400 to-transparent rounded opacity-30 animate-pulse delay-1500"></div>
    </div>
  )
}

export default NotFoundPage