import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { BarChart3, Users, Gavel, Heart, UserPlus } from 'lucide-react'

const TeamHeader = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'candidates', name: 'Candidates', icon: Users },
    { id: 'registrations', name: 'Registrations', icon: UserPlus },
    { id: 'participants', name: 'Participants', icon: Users },
    { id: 'wishlist', name: 'Wish List', icon: Heart },
    { id: 'auction', name: 'Auction Room', icon: Gavel },
  ]

  return (
    <header className="bg-white border border-gray-200 shadow-sm rounded-lg max-w-fit mx-auto mb-6">
      <div className="px-6">
        <div className="flex justify-center items-center h-14">
          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'border-2 border-yellow-400 text-yellow-600 shadow-sm font-semibold'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="py-3 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'border-2 border-yellow-400 text-yellow-600 font-semibold'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

export default TeamHeader
