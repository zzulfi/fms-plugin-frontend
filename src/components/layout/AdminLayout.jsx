import React, { useState } from 'react'
import AdminHeader from '../admin/AdminHeader'
import AdminDashBoard from '../admin/AdminDashBoard'
import Teams from '../admin/Teams'
import Participants from '../admin/Participants'
import AuctionRoom from '../admin/AuctionRoom'
import Candidates from '../admin/Candidates'

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashBoard setActiveTab={setActiveTab} />
      case 'teams':
        return <Teams />
      case 'participants':
        return <Participants />
      case 'auction':
        return <AuctionRoom />
      case 'candidates':
        return <Candidates />
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