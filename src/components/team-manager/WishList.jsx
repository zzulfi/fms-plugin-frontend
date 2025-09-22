import React from 'react'
import { Heart, ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

const WishList = ({ setActiveTab }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-bold">Draft Wishlist</h2>
          </div>
          <p className="text-muted-foreground">
            Your preferred participants for team selection, ordered by priority.
          </p>
        </div>
      </div>
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No participants in your wishlist</h3>
        <p className="text-muted-foreground mb-4">
          Start adding participants you're interested in to build your draft strategy.
        </p>
        <Button 
          onClick={() => setActiveTab('participants')}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium transition-colors"
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Browse Participants
        </Button>
      </div>
    </div>
  )
}

export default WishList
