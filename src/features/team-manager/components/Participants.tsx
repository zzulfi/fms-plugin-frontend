import { useState, useMemo, useEffect } from 'react'
import { Plus, Search, Filter, ArrowDownWideNarrow, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '../../../shared/components/ui/button'
import { Badge } from '../../../shared/components/ui/badge'
import { Input } from '../../../shared/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../shared/components/ui/popover'
import { participantService } from '../../admin/services'
import type { WishlistItem, Participant } from '../../../shared/types'

const Participants = () => {
  const [participantsList, setParticipantsList] = useState<any[]>([])
  const [wishList, setWishList] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch participants from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const participants = await participantService.getParticipants()
        // Filter for available participants (not assigned to teams)
        const availableParticipants = participants.filter((p: any) => !p.hasTeam)
        setParticipantsList(availableParticipants)
        setError(null)
      } catch (err) {
        setError('Failed to load participants')
        console.error('Error fetching participants:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])
  
  // Search, Filter, and Sort states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [skillFilter, setSkillFilter] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [showSearch, setShowSearch] = useState(false)
  
  // Mock current team (in real app, this would come from auth context)
  const currentTeam = "Axis" // This should come from auth context

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const handleSelect = (participantId: number) => {
    setSelectedIds((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId]
    )
  }

  const handleBulkAdd = () => {
    const toAdd = filteredAndSortedParticipants.filter(
      (p) => selectedIds.includes(p.id) && !isInWishList(p.id)
    )
    if (toAdd.length === 0) return
    // add each and update status inside addToWishList
    toAdd.forEach((participant) => addToWishList(participant))
    setSelectedIds([])
  }

  // wishlist is intentionally in-memory only for this session (no localStorage sync)

  // Get unique skills and statuses from current participants
  const uniqueSkills = [...new Set(participantsList.map(p => p.Skill))]
  const uniqueStatuses = [...new Set(participantsList.map(p => p.Status))]

  // Filtered and sorted participants
  const filteredAndSortedParticipants = useMemo(() => {
    let filtered = participantsList.filter(participant => {
      const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          participant.Skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          participant.Experience.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'All' || participant.Status === statusFilter
      const matchesSkill = skillFilter === 'All' || participant.Skill === skillFilter
      
      return matchesSearch && matchesStatus && matchesSkill
    })

    // Sort
    filtered.sort((a, b) => {
      let valueA, valueB
      
      switch (sortBy) {
        case 'name':
          valueA = a.name.toLowerCase()
          valueB = b.name.toLowerCase()
          break
        case 'skill':
          valueA = a.Skill.toLowerCase()
          valueB = b.Skill.toLowerCase()
          break
        case 'experience':
          valueA = a.Experience.toLowerCase()
          valueB = b.Experience.toLowerCase()
          break
        case 'status':
          valueA = a.Status.toLowerCase()
          valueB = b.Status.toLowerCase()
          break
        case 'id':
          valueA = a.id
          valueB = b.id
          break
        default:
          valueA = a.name.toLowerCase()
          valueB = b.name.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0
      }
    })

    return filtered
  }, [participantsList, searchTerm, statusFilter, skillFilter, sortBy, sortOrder])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowDownWideNarrow className="h-4 w-4" />
    return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }
  
  const getCurrentTeamWishList = () => {
    const teamWishList = wishList.find(w => w.team === currentTeam)
    return teamWishList ? teamWishList.participants : []
  }
  
  const isInWishList = (participantId: number) => {
    const currentWishList = getCurrentTeamWishList()
    return currentWishList.some((p: any) => p.id === participantId)
  }
  
  // Add a single participant to the current team's wishlist and mark as In Wishlist
  const addToWishList = (participant: Participant) => {
    // avoid duplicates
    if (isInWishList(participant.id)) return

    const updatedWishList = wishList.map(teamWishList => {
      if (teamWishList.team === currentTeam) {
        return {
          ...teamWishList,
          participants: [...teamWishList.participants, participant]
        }
      }
      return teamWishList
    })

    // update component state and persist
    setWishList(updatedWishList)
    localStorage.setItem('fms_wishlist', JSON.stringify(updatedWishList))

    // Update participantsList status
    setParticipantsList(prev => prev.map(p => p.id === participant.id ? { ...p, Status: 'In Wishlist' } : p))
  }
  


  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Loading participants...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available Participants</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Action Icons */}
          <div className="flex items-center gap-1 ml-2">
            {/* Bulk Add Button */}
            <Button
              variant={selectedIds.length > 0 ? 'default' : 'ghost'}
              size="icon"
              title="Add selected to Wishlist"
              onClick={handleBulkAdd}
              disabled={selectedIds.length === 0}
              className={`cursor-pointer transition-colors duration-200 ${selectedIds.length === 0 ? 'opacity-50 pointer-events-none' : 'hover:bg-yellow-100'}`}
            >
              <Plus className={`h-5 w-5 ${selectedIds.length > 0 ? 'text-white' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowSearch(!showSearch)
                if (!showSearch) {
                  setTimeout(() => document.getElementById('search-input')?.focus(), 100)
                } else {
                  setSearchTerm('')
                }
              }}
              title="Search"
              className="cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Filter"
                  className="cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                >
                  <Filter className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <div className="space-y-4">
                  <div className="px-2 py-1 text-sm font-medium text-muted-foreground">Filter by</div>
                  
                  {/* Status Filter */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Status</div>
                    <div className="space-y-1">
                      {['All', ...uniqueStatuses].map((status) => (
                        <label key={status} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="statusFilter"
                            value={status}
                            checked={statusFilter === status}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-sm">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Skill Filter */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Skill</div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {['All', ...uniqueSkills].map((skill) => (
                        <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="skillFilter"
                            value={skill}
                            checked={skillFilter === skill}
                            onChange={(e) => setSkillFilter(e.target.value)}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-sm">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  <div className="pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setStatusFilter('All')
                        setSkillFilter('All')
                      }}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Sort"
                  className="cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                >
                  <ArrowDownWideNarrow className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="space-y-1">
                  <div className="px-2 py-1 text-sm font-medium text-muted-foreground">Sort by</div>
                  
                  <Button
                    variant={sortBy === 'name' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleSort('name')}
                    className="w-full justify-start gap-2 cursor-pointer hover:bg-[#f0f0f0]"
                  >
                    {getSortIcon('name')}
                    Name
                  </Button>
                  
                  <Button
                    variant={sortBy === 'skill' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleSort('skill')}
                    className="w-full justify-start gap-2 cursor-pointer hover:bg-[#f0f0f0]"
                  >
                    {getSortIcon('skill')}
                    Skill
                  </Button>
                  
                  <Button
                    variant={sortBy === 'experience' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleSort('experience')}
                    className="w-full justify-start gap-2 cursor-pointer hover:bg-[#f0f0f0]"
                  >
                    {getSortIcon('experience')}
                    Experience
                  </Button>
                  
                  <Button
                    variant={sortBy === 'status' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleSort('status')}
                    className="w-full justify-start gap-2 cursor-pointer hover:bg-[#f0f0f0]"
                  >
                    {getSortIcon('status')}
                    Status
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Search Controls */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        {showSearch && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="search-input"
              placeholder="Search participants..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          <Badge variant="outline" className="border-gray-300">
            Available: {participantsList.length}
          </Badge>
          <Badge variant="outline" className="border-yellow-400 text-yellow-600">
            Filtered: {filteredAndSortedParticipants.length}
          </Badge>
          <Badge variant="outline" className="border-gray-300">
            In Wishlist: {getCurrentTeamWishList().length}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedParticipants.map((participant) => (
          <div key={participant.id} className="bg-card p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow relative">
            {/* Selection Checkbox for Not Selected participants */}
            {participant.Status === 'Not Selected' && !isInWishList(participant.id) && (
              <label className="absolute top-3 right-3 flex items-center gap-1 z-10 rounded px-2 py-1 shadow">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(participant.id)}
                  onChange={() => handleSelect(participant.id)}
                  className="accent-yellow-400 cursor-pointer"
                  title="Select to add to wishlist"
                />
              </label>
            )}
            <div className="mb-3">
              <h3 className="font-semibold text-lg text-foreground">{participant.name}</h3>
              <p className="text-sm text-muted-foreground">ID: {participant.id}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Skill:</span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                  {participant.Skill}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Experience:</span>
                <span className="text-sm text-foreground">{participant.Experience}</span>
              </div>
              {/* Status badge moved to bottom */}
              <div className="flex justify-end mt-3">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  participant.Status === 'In Wishlist' ? 'bg-green-100 text-green-800' :
                  participant.Status === 'Not Selected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {participant.Status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredAndSortedParticipants.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {searchTerm || statusFilter !== 'All' || skillFilter !== 'All' ? (
              <>
                <p className="text-lg font-medium mb-2">No participants found</p>
                <p>Try adjusting your search or filter criteria.</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">No participants available</p>
                <p>All participants have been drafted or are not available.</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom Count Display */}
      <div className="flex justify-center mt-6 pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredAndSortedParticipants.length}</span> of <span className="font-medium text-foreground">{participantsList.length}</span> participants
        </div>
      </div>
    </div>
  )
}

export default Participants
