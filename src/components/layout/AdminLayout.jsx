import React, { useState } from 'react'
import AdminHeader from '../admin/AdminHeader'
import Teams from '../admin/Teams'
import Candidates from '../admin/Candidates'
import AuctionRoom from '../admin/AuctionRoom'

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Admin Dashboard</h2>
              <p className="text-muted-foreground mb-8">
                Welcome to the admin control panel. Here you can manage all aspects of the system.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h3 className="text-xl font-semibold mb-2"> Team Management</h3>
                  <p className="text-muted-foreground mb-4">Manage teams and their configurations</p>
                  <button 
                    onClick={() => setActiveTab('teams')}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                  >
                    Go to Teams
                  </button>
                </div>
                
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h3 className="text-xl font-semibold mb-2"> Candidate Management</h3>
                  <p className="text-muted-foreground mb-4">Oversee candidate registrations</p>
                  <button 
                    onClick={() => setActiveTab('candidates')}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                  >
                    Go to Candidates
                  </button>
                </div>
                
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h3 className="text-xl font-semibold mb-2"> Auction Room</h3>
                  <p className="text-muted-foreground mb-4">Control the auction process</p>
                  <button 
                    onClick={() => setActiveTab('auction')}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                  >
                    Go to Auction
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'teams':
        return <Teams />
      case 'candidates':
        return <Candidates />
      case 'auction':
        return <AuctionRoom />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderTabContent()}
    </div>
  )
}

export default AdminLayout