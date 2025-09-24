import React, { useState, useMemo } from 'react'
import { Plus, Search, Filter, ArrowDownWideNarrow, ArrowUp, ArrowDown } from 'lucide-react'
import participants from '@/data/participants.js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const Participants = () => {
  const [participantsList, setParticipantsList] = useState(participants)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [skillFilter, setSkillFilter] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [showSearch, setShowSearch] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    skill: '',
    experience: '',
    status: 'Not Selected'
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
    if (!formData.name || !formData.skill || !formData.experience) {
      alert('Please fill in all required fields')
      return
    }

    // Create new participant
    const newParticipant = {
      id: participantsList.length + 1,
      name: formData.name,
      Skill: formData.skill,
      Experience: formData.experience,
      Status: formData.status,
      department: 'Secondary'
    }

    // Add to participants list
    setParticipantsList(prev => [...prev, newParticipant])
    
    // Reset form and close sheet
    setFormData({ name: '', skill: '', experience: '', status: 'Not Selected' })
    setIsSheetOpen(false)
  }

  const skillOptions = [
    'JavaScript', 'Python', 'Java', 'C#', 'C++', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
    'TypeScript', 'Kotlin', 'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask',
    'Spring Boot', 'Laravel', 'Express.js', 'Next.js', 'Nuxt.js', 'Flutter', 'React Native'
  ]

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

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowDownWideNarrow className="h-4 w-4" />
    return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-medium text-gray-900">Candidates</h2>
        </div>
        
        <div className="flex items-center gap-2">
          
          
          {/* All Icons on the Right */}
          <div className="flex items-center gap-1 ml-2">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Add Candidate"
                  className="cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add New Candidate</SheetTitle>
                  <SheetDescription>
                    Register a new candidate by filling out the form below.
                  </SheetDescription>
                </SheetHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter candidate's full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="skill">Primary Skill *</Label>
                    <select
                      id="skill"
                      name="skill"
                      value={formData.skill}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      required
                    >
                      <option value="">Select primary skill</option>
                      {skillOptions.map(skill => (
                        <option key={skill} value={skill}>{skill}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience *</Label>
                    <Input
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="e.g., 3 years, 6 months, Fresh Graduate"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="Not Selected">Not Selected</option>
                      <option value="Selected">Selected</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black">
                      Add Candidate
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
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowSearch(!showSearch)
                if (!showSearch) {
                  // Focus the input after a brief delay to ensure it's rendered
                  setTimeout(() => document.getElementById('search-input')?.focus(), 100)
                } else {
                  // Clear search when hiding
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedParticipants.map((participant) => (
          <div key={participant.id} className="bg-card p-4 rounded-lg border shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg text-foreground">{participant.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {participant.id}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                participant.Status === 'Selected' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {participant.Status}
              </div>
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
                <p>Add your first candidate to get started.</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom Count Display */}
      <div className="flex justify-center mt-6 pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredAndSortedParticipants.length}</span> of <span className="font-medium text-foreground">{participantsList.length}</span> candidates
        </div>
      </div>
    </div>
  )
}

export default Participants