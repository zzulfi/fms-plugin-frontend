import { useState, useEffect } from 'react'
import { Plus, Copy, Check, Clock, Users, Shield } from 'lucide-react'
import { adminAuctionService, teamService, sectionService, type AdminAuctionResponse, type UserResponse } from '../services'
import { Button } from '../../../shared/components/ui/button'
import { Input } from '../../../shared/components/ui/input'
import { Label } from '../../../shared/components/ui/label'
import { Badge } from '../../../shared/components/ui/badge'
import { CustomDropdown } from '../../../shared/components/ui/CustomDropdown'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../../shared/components/ui/sheet'

interface Team {
  _id: string
  name: string
  colorCode?: string
}

interface Section {
  _id: string
  name: string
}

const Auctions = () => {
  const [auctionsList, setAuctionsList] = useState<AdminAuctionResponse[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    timerValue: '',
    timerUnit: 'minutes',
    extraTimeValue: '',
    extraTimeUnit: 'minutes',
    firstTeamsOrder: [] as string[],
    section: '',
    authorizedManagers: [] as string[]
  })

  // Fetch all required data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [auctionsData, teamsData, sectionsData, usersData] = await Promise.all([
          adminAuctionService.getAuctions(),
          teamService.getTeams(),
          sectionService.getSections(),
          adminAuctionService.getUsers()
        ])
        
        setAuctionsList(auctionsData)
        setTeams(teamsData)
        setSections(sectionsData)
        setUsers(usersData)
        setError(null)
      } catch (err) {
        setError('Failed to load data')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDropdownChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTeamOrderChange = (teamId: string) => {
    setFormData(prev => {
      const currentOrder = [...prev.firstTeamsOrder]
      const index = currentOrder.indexOf(teamId)
      
      if (index > -1) {
        // Remove team if already selected
        currentOrder.splice(index, 1)
      } else {
        // Add team to order
        currentOrder.push(teamId)
      }
      
      return {
        ...prev,
        firstTeamsOrder: currentOrder
      }
    })
  }

  const moveTeamUp = (index: number) => {
    if (index > 0) {
      setFormData(prev => {
        const newOrder = [...prev.firstTeamsOrder]
        const temp = newOrder[index]
        newOrder[index] = newOrder[index - 1]
        newOrder[index - 1] = temp
        return {
          ...prev,
          firstTeamsOrder: newOrder
        }
      })
    }
  }

  const moveTeamDown = (index: number) => {
    setFormData(prev => {
      if (index < prev.firstTeamsOrder.length - 1) {
        const newOrder = [...prev.firstTeamsOrder]
        const temp = newOrder[index]
        newOrder[index] = newOrder[index + 1]
        newOrder[index + 1] = temp
        return {
          ...prev,
          firstTeamsOrder: newOrder
        }
      }
      return prev
    })
  }

  const handleManagerSelection = (userId: string) => {
    setFormData(prev => {
      const currentManagers = [...prev.authorizedManagers]
      const index = currentManagers.indexOf(userId)
      
      if (index > -1) {
        currentManagers.splice(index, 1)
      } else {
        currentManagers.push(userId)
      }
      
      return {
        ...prev,
        authorizedManagers: currentManagers
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name.trim() || !formData.section || formData.firstTeamsOrder.length === 0) {
      alert('Please fill in all required fields (Name, Section, and at least one team in order)')
      return
    }

    try {
      // Convert time to seconds
      let timer: number | undefined
      let extraTime: number | undefined
      
      if (formData.timerValue) {
        const value = parseInt(formData.timerValue) || 0
        timer = formData.timerUnit === 'minutes' ? value * 60 : value
      }
      
      if (formData.extraTimeValue) {
        if (!timer) {
          alert('Extra time can only be set if timer is provided')
          return
        }
        const value = parseInt(formData.extraTimeValue) || 0
        extraTime = formData.extraTimeUnit === 'minutes' ? value * 60 : value
      }

      const auctionData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        timer,
        extraTime,
        firstTeamsOrder: formData.firstTeamsOrder,
        section: formData.section,
        authorizedManagers: formData.authorizedManagers.length > 0 ? formData.authorizedManagers : undefined
      }

      const newAuction = await adminAuctionService.createAuction(auctionData)
      
      // Add to auctions list
      setAuctionsList(prev => [...prev, newAuction])
      
      // Reset form and close sheet
      setFormData({
        name: '', description: '', timerValue: '', timerUnit: 'minutes',
        extraTimeValue: '', extraTimeUnit: 'minutes', firstTeamsOrder: [],
        section: '', authorizedManagers: []
      })
      setIsSheetOpen(false)
    } catch (err) {
      alert('Failed to create auction')
      console.error('Error creating auction:', err)
    }
  }

  const copyToClipboard = async (text: string, auctionId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(auctionId)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', text: 'Draft' },
      live: { color: 'bg-green-100 text-green-800', text: 'Live' },
      completed: { color: 'bg-blue-100 text-blue-800', text: 'Completed' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    
    return (
      <Badge className={`${config.color} text-xs px-2 py-1`}>
        {config.text}
      </Badge>
    )
  }

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t._id === teamId)
    return team?.name || 'Unknown Team'
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
        <h2 className="text-xl font-semibold text-gray-900">Auctions</h2>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black flex items-center gap-1 px-3 py-2 h-8 text-sm">
              <Plus className="h-3 w-3" />
              Add Auction
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-white/95 backdrop-blur-sm border-l border-gray-200 animate-slide-in-right flex flex-col h-full">
            <SheetHeader className="pb-4 flex-shrink-0">
              <SheetTitle className="text-lg font-semibold text-gray-900">Add New Auction</SheetTitle>
              <SheetDescription className="text-sm text-gray-600">
                Create a new auction with teams, sections, and timing settings.
              </SheetDescription>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto pr-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name - Required */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-900">Auction Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter auction name"
                    className="h-10 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400/20"
                    required
                  />
                </div>
                
                {/* Description - Optional */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-900">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter auction description (optional)"
                    className="w-full h-20 px-3 py-2 text-sm border border-gray-200 rounded-md focus:border-yellow-400 focus:ring-yellow-400/20 resize-none"
                    rows={3}
                  />
                </div>
                
                {/* Timer - Optional */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Timer (Optional)</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        name="timerValue"
                        type="number"
                        value={formData.timerValue}
                        onChange={handleInputChange}
                        placeholder="Enter time"
                        className="h-10 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400/20"
                        min="1"
                      />
                    </div>
                    <div className="flex-1">
                      <CustomDropdown
                        value={formData.timerUnit}
                        onChange={(value) => handleDropdownChange('timerUnit', value)}
                        options={[
                          { value: 'minutes', label: 'Minutes' },
                          { value: 'seconds', label: 'Seconds' }
                        ]}
                        placeholder="Select unit"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Extra Time - Optional, disabled if no timer */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Extra Time (Optional)</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        name="extraTimeValue"
                        type="number"
                        value={formData.extraTimeValue}
                        onChange={handleInputChange}
                        placeholder="Enter extra time"
                        className="h-10 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400/20"
                        disabled={!formData.timerValue}
                        min="1"
                      />
                    </div>
                    <div className="flex-1">
                      <CustomDropdown
                        value={formData.extraTimeUnit}
                        onChange={(value) => handleDropdownChange('extraTimeUnit', value)}
                        options={[
                          { value: 'minutes', label: 'Minutes' },
                          { value: 'seconds', label: 'Seconds' }
                        ]}
                        placeholder="Select unit"
                        disabled={!formData.timerValue}
                      />
                    </div>
                  </div>
                  {!formData.timerValue && (
                    <p className="text-xs text-gray-500">Extra time is only available when timer is set</p>
                  )}
                </div>
                
                {/* Section - Required */}
                <CustomDropdown
                  label="Section *"
                  value={formData.section}
                  onChange={(value) => handleDropdownChange('section', value)}
                  options={sections.map((section) => ({
                    value: section._id,
                    label: section.name
                  }))}
                  placeholder="Select section"
                />
                
                {/* First Teams Order - Required */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">First Call Team Order *</Label>
                  <div className="space-y-2">
                    {/* Team selection */}
                    <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                      {teams.map((team) => {
                        const isSelected = formData.firstTeamsOrder.includes(team._id)
                        return (
                          <label
                            key={team._id}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer text-sm ${
                              isSelected 
                                ? 'bg-yellow-50 border border-yellow-200' 
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleTeamOrderChange(team._id)}
                              className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                            />
                            <div className="flex items-center gap-2">
                              {team.colorCode && (
                                <div 
                                  className="w-3 h-3 rounded-full border border-gray-300"
                                  style={{ backgroundColor: team.colorCode }}
                                />
                              )}
                              <span>{team.name}</span>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                    
                    {/* Selected teams order */}
                    {formData.firstTeamsOrder.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700">Order ({formData.firstTeamsOrder.length} teams):</p>
                        <div className="space-y-1 max-h-24 overflow-y-auto border border-gray-200 rounded-md p-2">
                          {formData.firstTeamsOrder.map((teamId, index) => {
                            const team = teams.find(t => t._id === teamId)
                            return (
                              <div key={teamId} className="flex items-center justify-between bg-gray-50 p-1 rounded text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 bg-yellow-400 text-black rounded-full flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                  </span>
                                  {team?.colorCode && (
                                    <div 
                                      className="w-2 h-2 rounded-full border border-gray-300"
                                      style={{ backgroundColor: team.colorCode }}
                                    />
                                  )}
                                  <span>{team?.name}</span>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    type="button"
                                    onClick={() => moveTeamUp(index)}
                                    disabled={index === 0}
                                    className="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-30"
                                  >
                                    ↑
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveTeamDown(index)}
                                    disabled={index === formData.firstTeamsOrder.length - 1}
                                    className="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-30"
                                  >
                                    ↓
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Authorized Managers - Optional */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Authorized Managers (Optional)</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                    {users.filter(user => user.role === 'team-manager').map((user) => {
                      const isSelected = formData.authorizedManagers.includes(user._id)
                      return (
                        <label
                          key={user._id}
                          className={`flex items-center gap-2 p-2 rounded cursor-pointer text-sm ${
                            isSelected 
                              ? 'bg-yellow-50 border border-yellow-200' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation()
                              handleManagerSelection(user._id)
                            }}
                            className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                            {user.team && (
                              <div className="text-xs text-gray-600">Team: {user.team.name}</div>
                            )}
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium h-10"
                  >
                    Create Auction
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
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {auctionsList.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded">
          <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-sm mb-3">No auctions yet</p>
          <Button 
            onClick={() => setIsSheetOpen(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm px-3 py-1 h-8"
          >
            Create first auction
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.isArray(auctionsList) && auctionsList.map((auction) => (
            <div key={auction._id} className="bg-white p-4 rounded border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{auction.name}</h3>
                  {auction.description && (
                    <p className="text-xs text-gray-600 mb-2">{auction.description}</p>
                  )}
                </div>
                {getStatusBadge(auction.status)}
              </div>
              
              <div className="space-y-2 text-xs">
                {/* Section */}
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">Section:</span>
                  <span className="font-medium">{auction.section.name}</span>
                </div>
                
                {/* Timer */}
                {auction.timer && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Timer:</span>
                    <span className="font-medium">{formatTime(auction.timer)}</span>
                    {auction.extraTime && (
                      <span className="text-gray-500">(+{formatTime(auction.extraTime)})</span>
                    )}
                  </div>
                )}
                
                {/* Access Code */}
                {auction.accessCode && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Access Code:</span>
                    <div className="flex items-center gap-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono select-all">
                        {auction.accessCode}
                      </code>
                      <button
                        onClick={() => copyToClipboard(auction.accessCode!, auction._id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Copy access code"
                      >
                        {copiedCode === auction._id ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Teams Order */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Teams Order:</span>
                  </div>
                  <div className="pl-5">
                    {auction.firstTeamsOrder.map((teamId, index) => {
                      const team = teams.find(t => t._id === teamId)
                      return (
                        <div key={teamId} className="flex items-center gap-2 text-xs">
                          <span className="w-4 h-4 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            {team?.colorCode && (
                              <div 
                                className="w-2 h-2 rounded-full border border-gray-300"
                                style={{ backgroundColor: team.colorCode }}
                              />
                            )}
                            <span>{getTeamName(teamId)}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* Authorized Managers */}
                {auction.authorizedManagers && auction.authorizedManagers.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600">Managers:</span>
                    </div>
                    <div className="pl-5 space-y-1">
                      {auction.authorizedManagers.map((manager) => (
                        <div key={manager._id} className="text-xs">
                          <div className="font-medium">{manager.name}</div>
                          <div className="text-gray-500">{manager.email}</div>
                          {manager.team && (
                            <div className="text-gray-600">Team: {manager.team.name}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Auctions