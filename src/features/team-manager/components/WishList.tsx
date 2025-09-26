import { useEffect, useState } from 'react'
import { Heart, ArrowRight, X } from 'lucide-react'
import { Button } from '../../../shared/components/ui/button'
import { Badge } from '../../../shared/components/ui/badge'
import { useAuth } from '../../../shared/hooks/AuthContext'
import type { WishListProps, WishlistItem } from '../../../shared/types'

const WishList = ({ setActiveTab }: WishListProps) => {
  const { user } = useAuth()
  const [wishList, setWishList] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('fms_wishlist')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  // Get current team from auth context
  const currentTeam = user?.team || 'Unknown Team'

  useEffect(() => {
    // keep in sync if other code updates localStorage
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'fms_wishlist') {
        try {
          if (e.newValue) {
            setWishList(JSON.parse(e.newValue))
          }
        } catch (err) {}
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const getCurrentTeamWishList = () => {
    const team = wishList.find(w => w.team === currentTeam)
    return team ? team.participants : []
  }

  const removeFromWishList = (participantId: number) => {
    const updated = wishList.map(w => {
      if (w.team === currentTeam) {
        return { ...w, participants: w.participants.filter((p: any) => p.id !== participantId) }
      }
      return w
    })
    setWishList(updated)
    try { localStorage.setItem('fms_wishlist', JSON.stringify(updated)) } catch (e) {}
  }

  const items = getCurrentTeamWishList()

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
        <div className="flex items-center gap-2">
          <Badge variant="outline">{items.length} in wishlist</Badge>
          <Button onClick={() => setActiveTab('participants')} variant="ghost" className="ml-2">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p: any) => (
            <div key={p.id} className="bg-card p-4 rounded-lg border shadow-sm flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-muted-foreground">Skill: {p.skill}</p>
                <p className="text-sm text-muted-foreground">Experience: {p.experience}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button variant="outline" size="icon" onClick={() => removeFromWishList(p.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WishList
