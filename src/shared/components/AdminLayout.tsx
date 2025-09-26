import { useState } from 'react'
import AdminHeader from '../../features/admin/components/AdminHeader'
import AdminDashBoard from '../../features/admin/components/AdminDashBoard'
import Teams from '../../features/admin/components/Teams'
import Participants from '../../features/admin/components/Participants'
import Auctions from '../../features/admin/components/Auctions'
import AuctionRoom from '../../features/admin/components/AuctionRoom'
import Candidates from '../../features/admin/components/Candidates'

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
      case 'auctions':
        return <Auctions />
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