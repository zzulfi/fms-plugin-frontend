import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import teams from '@/data/teams'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const Teams = () => {
  const [teamsList, setTeamsList] = useState(teams)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    manager: '',
    colour: '#3b82f6' // Default blue color
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name || !formData.manager || !formData.colour) {
      alert('Please fill in all fields')
      return
    }

    // Create new team
    const newTeam = {
      id: teamsList.length + 1,
      name: formData.name,
      Manager: formData.manager,
      Colour: formData.colour
    }

    // Add to teams list
    setTeamsList(prev => [...prev, newTeam])
    
    // Reset form and close sheet
    setFormData({ name: '', manager: '', colour: '#3b82f6' })
    setIsSheetOpen(false)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Team Management</h2>
          <p className="text-gray-600">
            Here you can manage teams and their configurations.
          </p>
        </div>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Team
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Team</SheetTitle>
              <SheetDescription>
                Create a new team by filling out the form below.
              </SheetDescription>
            </SheetHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter team name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Input
                  id="manager"
                  name="manager"
                  value={formData.manager}
                  onChange={handleInputChange}
                  placeholder="Enter manager name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="colour">Team Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    id="colour"
                    name="colour"
                    type="color"
                    value={formData.colour}
                    onChange={handleInputChange}
                    className="w-16 h-10 border border-input rounded-md cursor-pointer bg-background"
                    required
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{formData.colour.toUpperCase()}</span>
                    <span className="text-xs text-muted-foreground">Click to change color</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black">
                  Add Team
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsSheetOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamsList.map((team) => (
          <div key={team.id} className="bg-card p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{team.name}</h3>
              <div 
                className="w-6 h-6 rounded-full border-2 border-border shadow-sm"
                style={{ backgroundColor: team.Colour }}
                title={`Team Color: ${team.Colour}`}
              />
            </div>
            <p className="text-muted-foreground text-sm mb-1">
              <span className="font-medium">Manager:</span> {team.Manager}
            </p>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <span className="font-medium">Color:</span> 
              <span className="font-mono text-xs">{team.Colour}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Teams
