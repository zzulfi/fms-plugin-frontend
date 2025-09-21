import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Welcome to FMS Plugin
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Choose your dashboard to get started
        </p>

        <div className="space-y-4">
          <Link 
            to="/admin"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            🔧 Admin Dashboard
          </Link>
          
          <Link 
            to="/team"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            👥 Team Manager Dashboard
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Features:</p>
          <ul className="mt-2 space-y-1">
            <li>• Admin management tools</li>
            <li>• Team coordination features</li>
            <li>• Real-time dashboard updates</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Home