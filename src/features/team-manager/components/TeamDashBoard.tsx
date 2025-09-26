import { Users, Gavel, TrendingUp, Clock, Award, Heart, UserPlus } from 'lucide-react'
import type { TeamDashBoardProps } from '../../../shared/types'

const TeamDashBoard = ({ setActiveTab }: TeamDashBoardProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Players</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +3 this week
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Budget</p>
              <p className="text-2xl font-bold text-gray-900">₹18L</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-gray-600 text-sm flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              ₹2L spent
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Heart className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-blue-600 text-sm flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              2 pending
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Registrations</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <UserPlus className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +5 new today
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Candidates Management</h3>
                <p className="text-sm text-gray-600">15 players in team</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">View and manage your team's current player roster and statistics.</p>
            <button 
              onClick={() => setActiveTab('candidates')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md font-medium transition-colors"
            >
              Manage Candidates
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Gavel className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Auction Room</h3>
                <p className="text-sm text-gray-600">Live auction active</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Participate in live auctions and bid for your desired players.</p>
            <button 
              onClick={() => setActiveTab('auction')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md font-medium transition-colors"
            >
              Join Auction
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-pink-100 rounded-lg group-hover:bg-pink-200 transition-colors">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Wish List</h3>
                <p className="text-sm text-gray-600">8 players listed</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Manage your wishlist of players you want to target in auctions.</p>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md font-medium transition-colors"
            >
              View Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamDashBoard