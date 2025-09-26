import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { teamService } from '../services'
import { Button } from '../../../shared/components/ui/button'
import { Input } from '../../../shared/components/ui/input'
import { Label } from '../../../shared/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../../shared/components/ui/sheet'

const Teams = () => {
  const [teamsList, setTeamsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    colour: '#3b82f6' // Default blue color
  })

  // Fetch teams from API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true)
        const teams = await teamService.getTeams()
        setTeamsList(teams)
        setError(null)
      } catch (err) {
        setError('Failed to load teams')
        console.error('Error fetching teams:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name.trim()) {
      alert('Team name is required')
      return
    }

    try {
      // Create new team via API
      const newTeam = await teamService.createTeam({
        name: formData.name.trim(),
        logoUrl: formData.logoUrl.trim() || undefined,
        colorCode: formData.colour
      })

      // Add to teams list
      setTeamsList(prev => [...prev, newTeam])
      
      // Reset form and close sheet
      setFormData({ name: '', logoUrl: '', colour: '#3b82f6' })
      setIsSheetOpen(false)
    } catch (err) {
      alert('Failed to create team')
      console.error('Error creating team:', err)
    }
  }

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-2 text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center py-8 bg-red-50 rounded border border-red-200">
          <p className="text-red-600 mb-3 text-sm">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 h-8"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Teams</h2>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black flex items-center gap-1 px-3 py-2 h-8 text-sm">
              <Plus className="h-3 w-3" />
              Add Team
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-white/95 backdrop-blur-sm border-l border-gray-200 animate-slide-in-right">
            <SheetHeader className="pb-4">
              <SheetTitle className="text-lg font-semibold text-gray-900">Add New Team</SheetTitle>
              <SheetDescription className="text-sm text-gray-600">
                Create a new team with name, optional logo, and color.
              </SheetDescription>
            </SheetHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-900">Team Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter team name"
                  className="h-10 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400/20"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logoUrl" className="text-sm font-medium text-gray-900">Logo URL</Label>
                <Input
                  id="logoUrl"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo.png (optional)"
                  className="h-10 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="colour" className="text-sm font-medium text-gray-900">Team Color Code</Label>
                <div className="flex items-center gap-3">
                  <input
                    id="colour"
                    name="colour"
                    type="color"
                    value={formData.colour}
                    onChange={handleInputChange}
                    className="w-10 h-10 border border-gray-200 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">{formData.colour.toUpperCase()}</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium h-10"
                >
                  Create Team
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsSheetOpen(false)}
                  className="flex-1 h-10 border-gray-200 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {teamsList.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded">
          <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-sm mb-3">No teams yet</p>
          <Button 
            onClick={() => setIsSheetOpen(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm px-3 py-1 h-8"
          >
            Create first team
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {teamsList.map((team) => (
            <div key={team._id} className="bg-white p-4 rounded border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{team.name}</h3>
                <div 
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: team.colorCode }}
                  title={`Team Color: ${team.colorCode}`}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Color:</span> 
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {team.colorCode}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Teams
