import { useState } from 'react'
import { Switch } from '../../../shared/components/ui/switch'
import { Gavel } from 'lucide-react'

const AuctionRoom = () => {
  const [auctionStarted, setAuctionStarted] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Gavel className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Auction Room</h1>
          <p className="text-gray-600">
            {auctionStarted 
              ? "The auction is now live! Players are being auctioned."
              : "The auction hasn't started yet. Toggle the switch to begin the auction."
            }
          </p>
        </div>

        {/* Auction Control Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            {/* Switch Control */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Start/Stop Auction</h4>
              <p className="text-sm text-gray-600">Toggle to control the auction session</p>
            </div>
            <Switch 
              checked={auctionStarted}
              onCheckedChange={setAuctionStarted}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionRoom
