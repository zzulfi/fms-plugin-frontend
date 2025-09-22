import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { BarChart3, Users, User, Gavel } from 'lucide-react'

const AdminHeader = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'teams', name: 'Teams', icon: Users },
    { id: 'candidates', name: 'Candidates', icon: User },
    { id: 'auction', name: 'Auction Room', icon: Gavel }
  ]

  return (
    <header className="bg-card border-b border-border shadow-sm rounded-4xl max-w-fit mx-auto">
      <div className="px-4">
        <div className="flex justify-center items-center h-12">
          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-7">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground shadow-md border border-primary/20 scale-105'
                    : 'text-foreground hover:text-primary hover:bg-accent hover:scale-102'
                }`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-border">
          <div className="py-2 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left flex items-center px-2 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground shadow-md border border-primary/20'
                    : 'text-foreground hover:text-primary hover:bg-accent'
                }`}
              >
                <item.icon className="mr-1 h-4 w-4" />
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
