import { BarChart3, Users, Heart, Gavel } from 'lucide-react'
import type { TeamHeaderProps } from '../../../shared/types'
import { useNavigation } from '../../../shared/hooks/NavigationContext'
import { useEffect, useMemo } from 'react'

const TeamHeader = ({ activeTab, setActiveTab }: TeamHeaderProps) => {
  const { setNavItems, setActiveTabHandler, setActiveTab: setNavigationActiveTab } = useNavigation()

  const navItems = useMemo(() => [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'candidates', name: 'Candidates', icon: Users },
    { id: 'participants', name: 'Participants', icon: Users },
    { id: 'wishlist', name: 'Wish List', icon: Heart },
    { id: 'auction', name: 'Auction Room', icon: Gavel },
  ], [])

  // Set navigation items and register the setActiveTab handler when component mounts
  useEffect(() => {
    setNavItems(navItems)
    setActiveTabHandler(setActiveTab)
  }, [navItems, setNavItems, setActiveTabHandler, setActiveTab])

  // Update navigation context when activeTab changes
  useEffect(() => {
    setNavigationActiveTab(activeTab)
  }, [activeTab, setNavigationActiveTab])

  return (
    <header className="bg-white border border-gray-200 shadow-sm rounded-lg mx-auto mb-6">
      <div className="px-6">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center items-center h-14">
          <nav className="flex space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? 'border-2 border-yellow-400 text-yellow-600 shadow-sm font-semibold'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={{ minHeight: '44px' }}
              >
                <item.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation - Now handled by Layout sidebar, so hidden */}
        <div className="hidden">
          {/* Mobile navigation moved to Layout component sidebar */}
        </div>
      </div>
    </header>
  )
}

export default TeamHeader
