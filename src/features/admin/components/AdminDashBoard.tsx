import { BarChart3, Users, User, Gavel, TrendingUp, Clock, Award } from 'lucide-react'
import type { AdminDashBoardProps } from '../../../shared/types'

const AdminDashBoard = ({ setActiveTab }: AdminDashBoardProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teams</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +2 this week
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Players</p>
              <p className="text-2xl font-bold text-gray-900">248</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +15 new registrations
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Auctions</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Gavel className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-blue-600 text-sm flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              2 ending soon
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">₹2.4L</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-gray-600 text-sm flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              ₹1.8L spent
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Team Management</h3>
                <p className="text-sm text-gray-600">4 teams registered</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Create, edit, and manage team configurations and settings.</p>
            <button
              onClick={() => setActiveTab('teams')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md font-medium transition-colors"
            >
              Manage Teams
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Player Management</h3>
                <p className="text-sm text-gray-600">248 players available</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Oversee player registrations, profiles, and availability status.</p>
            <button
              onClick={() => setActiveTab('participants')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md font-medium transition-colors"
            >
              Manage Players
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Gavel className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Auction Management</h3>
                <p className="text-sm text-gray-600">3 auctions created</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Create, configure, and manage auction settings and teams.</p>
            <button
              onClick={() => setActiveTab('auctions')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md font-medium transition-colors"
            >
              Manage Auctions
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                <Gavel className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Auction Room</h3>
                <p className="text-sm text-gray-600">Live auction control</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Monitor and control the auction process in real-time.</p>
            <button
              onClick={() => setActiveTab('auction')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md font-medium transition-colors"
            >
              Open Auction Room
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashBoard