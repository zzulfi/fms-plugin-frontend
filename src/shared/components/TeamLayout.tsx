import { useState } from 'react'
import TeamHeader from '../../features/team-manager/components/TeamHeader'
import TeamDashBoard from '../../features/team-manager/components/TeamDashBoard'
import Participants from '../../features/team-manager/components/Participants'
import AuctionRoom from '../../features/team-manager/components/AuctionRoom'
import WishList from '../../features/team-manager/components/WishList'
import Candidates from '../../features/team-manager/components/Candidates'

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
