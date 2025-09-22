import React, { useState } from 'react'
import TeamHeader from '../team-manager/TeamHeader'
import TeamDashBoard from '../team-manager/TeamDashBoard'
import Participants from '../team-manager/Participants'
import AuctionRoom from '../team-manager/AuctionRoom'
import WishList from '../team-manager/WishList'
import Registrations from '../team-manager/Registrations'
import Candidates from '../team-manager/Candidates'

const TeamLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <TeamDashBoard setActiveTab={setActiveTab} />
      case 'participants':
        return <Participants />
      case 'auction':
        return <AuctionRoom />
      case 'wishlist':
        return <WishList setActiveTab={setActiveTab} />
      case 'registrations':
        return <Registrations />
      case 'candidates':
        return <Candidates />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TeamHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderTabContent()}
    </div>
  )
}

export default TeamLayout
