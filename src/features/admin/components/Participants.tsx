import { useState, useEffect } from 'react'
import { Plus, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, MoreVertical, X } from 'lucide-react'
import { participantService, sectionService } from '../services'
import { Button } from '../../../shared/components/ui/button'
import { Input } from '../../../shared/components/ui/input'
import { Label } from '../../../shared/components/ui/label'
import { Switch } from '../../../shared/components/ui/switch' 
import { Popover, PopoverContent, PopoverTrigger } from '../../../shared/components/ui/popover'
import { CustomDropdown } from '../../../shared/components/ui/CustomDropdown'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../../../shared/components/ui/sheet'

const Participants = () => {
  const [participantsList, setParticipantsList] = useState<any[]>([])
  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalParticipants, setTotalParticipants] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(() => 
    parseInt(localStorage.getItem('participants-items-per-page') || '15')
  )

  // Filters and Sorting with localStorage persistence
  const [sectionFilter, setSectionFilter] = useState(() => 
    localStorage.getItem('participants-section-filter') || 'All'
  )
  const [genderFilter, setGenderFilter] = useState(() => 
    localStorage.getItem('participants-gender-filter') || 'All'
  )
  const [statusFilter, setStatusFilter] = useState(() => 
    localStorage.getItem('participants-status-filter') || 'All'
  )
  const [sortBy, setSortBy] = useState(() => 
    localStorage.getItem('participants-sort-by') || 'name'
  )
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => 
    (localStorage.getItem('participants-sort-order') as 'asc' | 'desc') || 'asc'
  )
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'MALE',
    section: '',
    admNo: '',
    isActive: true,
    achievements: '',
    skills: '',
    avatarUrl: ''
  })

  // Fetch sections
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const sectionsData = await sectionService.getSections()
        setSections(sectionsData)
      } catch (err) {
        console.error('Error fetching sections:', err)
      }
    }
    fetchSections()
  }, [])

  // Fetch participants with basic implementation
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true)
        const response = await participantService.getParticipants()
        setParticipantsList(Array.isArray(response) ? response : (response as any)?.data || [])
        setError(null)
      } catch (err) {
        setError('Failed to load participants')
        console.error('Error fetching participants:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchParticipants()
  }, [])

  // Persist itemsPerPage to localStorage
  useEffect(() => {
    localStorage.setItem('participants-items-per-page', itemsPerPage.toString())
  }, [itemsPerPage])

  // Filter and sort function
  const filterAndSortParticipants = (participants: any[]) => {
    let filtered = participants.filter(participant => {
      const matchesSearch = searchTerm === '' || 
        participant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.email?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesSection = sectionFilter === 'All' || participant.section === sectionFilter
      const matchesGender = genderFilter === 'All' || participant.gender === genderFilter
      const matchesStatus = statusFilter === 'All' || 
        (statusFilter === 'Active' && participant.isActive) ||
        (statusFilter === 'Inactive' && !participant.isActive)
      
      return matchesSearch && matchesSection && matchesGender && matchesStatus
    })

    // Sort participants
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'name':
          aValue = a.name || ''
          bValue = b.name || ''
          break
        case 'email':
          aValue = a.email || ''
          bValue = b.email || ''
          break
        case 'section':
          aValue = a.section || ''
          bValue = b.section || ''
          break
        case 'admNo':
          aValue = a.admNo || ''
          bValue = b.admNo || ''
          break
        default:
          aValue = a.name || ''
          bValue = b.name || ''
      }
      
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })

    return filtered
  }

  // Get current page data
  const getCurrentPageData = () => {
    const filteredData = filterAndSortParticipants(participantsList)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredData.slice(startIndex, endIndex)
  }

  // Update pagination when filters change
  useEffect(() => {
    const filteredData = filterAndSortParticipants(participantsList)
    setTotalParticipants(filteredData.length)
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage))
    
    // Reset to first page if current page is beyond available pages
    if (currentPage > Math.ceil(filteredData.length / itemsPerPage) && filteredData.length > 0) {
      setCurrentPage(1)
    }
  }, [participantsList, searchTerm, sectionFilter, genderFilter, statusFilter, sortBy, sortOrder])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isActive: checked
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.section) {
      alert('Please fill in all required fields (Name, Email, Section)')
      return
    }

    try {
      const participantData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        dob: formData.dob || new Date().toISOString().split('T')[0], // Default to today if empty
        gender: formData.gender as 'MALE' | 'FEMALE',
        section: formData.section,
        admNo: formData.admNo.trim() || undefined,
        isActive: formData.isActive,
        achievements: formData.achievements ? formData.achievements.split(',').map(s => s.trim()) : [],
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
        avatar: formData.avatarUrl.trim() || undefined
      }

      await participantService.createParticipant(participantData)
      
      // Refresh the list
      const response = await participantService.getParticipants()
      setParticipantsList(Array.isArray(response) ? response : (response as any)?.data || [])
      
      // Reset form and close sheet
      setFormData({
        name: '', email: '', phone: '', dob: '', gender: 'MALE',
        section: '', admNo: '', isActive: true, achievements: '', skills: '', avatarUrl: ''
      })
      setIsSheetOpen(false)
    } catch (err) {
      alert('Failed to create participant')
      console.error('Error creating participant:', err)
    }
  }

  const truncateText = (text: string | string[], maxLength: number = 30) => {
    if (Array.isArray(text)) {
      if (text.length === 0) return 'None'
      const joined = text.join(', ')
      return joined.length > maxLength ? joined.substring(0, maxLength) + '...' : joined
    }
    if (!text) return 'None'
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
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
      {/* Header with Actions */}
      <div className="mb-4 relative">
        {/* Mobile Search Bar Overlay (when active) */}
        {showSearch && (
          <div className="md:hidden absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-2 shadow-lg animate-slide-in-nearby">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 h-8 focus:border-yellow-400 focus:ring-yellow-400/20"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearch(false)}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Title and Actions Row */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Participants</h2>
          </div>
          
          <div className="flex items-center gap-2">
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              {showSearch && (
                <div className="absolute right-0 top-0 z-10 animate-slide-in-nearby">
                  <Input
                    type="text"
                    placeholder="Search participants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 h-8 focus:border-yellow-400 focus:ring-yellow-400/20"
                    autoFocus
                  />
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSearch(!showSearch)}
                className="h-8 px-2"
              >
                <Search className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-3">
                  <Filter className="h-3 w-3 mr-1" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Options</h4>
                  
                  <CustomDropdown
                    label="Section"
                    value={sectionFilter}
                    onChange={setSectionFilter}
                    options={[
                      { value: 'All', label: 'All Sections' },
                      ...sections.map(section => ({
                        value: section.name,
                        label: section.name
                      }))
                    ]}
                  />
                  
                  <CustomDropdown
                    label="Gender"
                    value={genderFilter}
                    onChange={setGenderFilter}
                    options={[
                      { value: 'All', label: 'All Genders' },
                      { value: 'MALE', label: 'Male' },
                      { value: 'FEMALE', label: 'Female' }
                    ]}
                  />
                  
                  <CustomDropdown
                    label="Status"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                      { value: 'All', label: 'All Status' },
                      { value: 'Active', label: 'Active' },
                      { value: 'Inactive', label: 'Inactive' }
                    ]}
                  />
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Sort */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-3">
                  <ArrowUpDown className="h-3 w-3 mr-1" />
                  Sort
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium">Sort Options</h4>
                  
                  <CustomDropdown
                    label="Sort By"
                    value={sortBy}
                    onChange={setSortBy}
                    options={[
                      { value: 'name', label: 'Name' },
                      { value: 'email', label: 'Email' },
                      { value: 'admNo', label: 'Admission No' }
                    ]}
                  />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Order</span>
                    <div className="flex space-x-2">
                      <Button
                        variant={sortOrder === 'asc' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSortOrder('asc')}
                        className="h-8 px-2"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant={sortOrder === 'desc' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSortOrder('desc')}
                        className="h-8 px-2"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button 
              className="bg-yellow-400 hover:bg-yellow-500 text-black flex items-center gap-1 px-3 py-2 h-8 text-sm"
              onClick={() => setIsSheetOpen(true)}
            >
              <Plus className="h-3 w-3" />
              Add Participant
            </Button>
          </div>

          {/* Mobile Actions - Search and Three-Dot Menu */}
          <div className="md:hidden flex items-center gap-2">
            {!showSearch && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSearch(true)}
                className="h-8 px-2"
              >
                <Search className="h-3 w-3" />
              </Button>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="space-y-2">
                  <Button 
                    className="w-full justify-start bg-yellow-400 hover:bg-yellow-500 text-black"
                    onClick={() => setIsSheetOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Participant
                  </Button>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="center" side="bottom">
                      <div className="space-y-4">
                        <h4 className="font-medium">Filter Options</h4>
                        
                        <CustomDropdown
                          label="Section"
                          value={sectionFilter}
                          onChange={setSectionFilter}
                          options={[
                            { value: 'All', label: 'All Sections' },
                            ...sections.map(section => ({
                              value: section.name,
                              label: section.name
                            }))
                          ]}
                        />
                        
                        <CustomDropdown
                          label="Gender"
                          value={genderFilter}
                          onChange={setGenderFilter}
                          options={[
                            { value: 'All', label: 'All Genders' },
                            { value: 'MALE', label: 'Male' },
                            { value: 'FEMALE', label: 'Female' }
                          ]}
                        />
                        
                        <CustomDropdown
                          label="Status"
                          value={statusFilter}
                          onChange={setStatusFilter}
                          options={[
                            { value: 'All', label: 'All Status' },
                            { value: 'Active', label: 'Active' },
                            { value: 'Inactive', label: 'Inactive' }
                          ]}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        Sort
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60" align="center" side="bottom">
                      <div className="space-y-4">
                        <h4 className="font-medium">Sort Options</h4>
                        
                        <CustomDropdown
                          label="Sort By"
                          value={sortBy}
                          onChange={setSortBy}
                          options={[
                            { value: 'name', label: 'Name' },
                            { value: 'email', label: 'Email' },
                            { value: 'admNo', label: 'Admission No' }
                          ]}
                        />
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Order</span>
                          <div className="flex space-x-2">
                            <Button
                              variant={sortOrder === 'asc' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setSortOrder('asc')}
                              className="h-8 px-2"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant={sortOrder === 'desc' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setSortOrder('desc')}
                              className="h-8 px-2"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          </div>
        </div>
      </div>
          
      {/* Single Sheet for both desktop and mobile */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent className="bg-white/95 backdrop-blur-sm border-l border-gray-200 animate-slide-in-right flex flex-col h-full">
              <SheetHeader className="pb-4 flex-shrink-0">
                <SheetTitle className="text-lg font-semibold text-gray-900">Add New Participant</SheetTitle>
                <SheetDescription className="text-sm text-gray-600">
                  Register a new participant with their details.
                </SheetDescription>
              </SheetHeader>
              
              <div className="flex-1 overflow-y-auto pr-2">
                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-900">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      className="h-10 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400/20"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-900">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email"
                      className="h-10 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400/20"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-900">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="h-10 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-sm font-medium text-gray-900">Date of Birth</Label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="h-10 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium text-gray-900">Gender</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="h-10 w-full px-3 border border-gray-200 bg-white rounded-md text-sm focus:border-yellow-400 focus:ring-yellow-400/20 focus:outline-none"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="section" className="text-sm font-medium text-gray-900">Section *</Label>
                    <select
                      id="section"
                      name="section"
                      value={formData.section}
                      onChange={handleInputChange}
                      className="h-10 w-full px-3 border border-gray-200 bg-white rounded-md text-sm focus:border-yellow-400 focus:ring-yellow-400/20 focus:outline-none"
                      required
                    >
                      <option value="">Select Section</option>
                      {sections.map((section) => (
                        <option key={section._id} value={section._id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="admNo" className="text-sm font-medium text-gray-900">Admission No</Label>
                    <Input
                      id="admNo"
                      name="admNo"
                      value={formData.admNo}
                      onChange={handleInputChange}
                      placeholder="Enter admission number"
                      className="h-10 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl" className="text-sm font-medium text-gray-900">Avatar URL</Label>
                    <Input
                      id="avatarUrl"
                      name="avatarUrl"
                      value={formData.avatarUrl}
                      onChange={handleInputChange}
                      placeholder="Enter avatar URL"
                      className="h-10 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="achievements" className="text-sm font-medium text-gray-900">Achievements</Label>
                  <Input
                    id="achievements"
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleInputChange}
                    placeholder="Enter achievements (comma separated)"
                    className="h-10 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-sm font-medium text-gray-900">Skills</Label>
                  <Input
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="Enter skills (comma separated)"
                    className="h-10 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400/20"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="isActive" className="text-sm font-medium text-gray-900">
                    Active Status
                  </Label>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium h-10"
                  >
                    Create Participant
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

      {/* Participants Grid */}
      {getCurrentPageData().length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded">
          <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-sm mb-3">No participants yet</p>
          <Button 
            onClick={() => setIsSheetOpen(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm px-3 py-1 h-8"
          >
            Create first participant
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {getCurrentPageData().map((participant) => (
            <div key={participant._id} className="bg-white p-4 rounded border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                {participant.avatarUrl ? (
                  <img
                    src={participant.avatarUrl}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                ) : null}
                <div 
                  className={`w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-medium text-sm ${participant.avatarUrl ? 'hidden' : ''}`}
                >
                  {getInitials(participant.name || 'U')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{participant.name}</h3>
                  <p className="text-xs text-gray-600">
                    {participant.section?.name || 'No Section'}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  participant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {participant.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              
              <div className="space-y-1 text-xs">
                {participant.team && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Team:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{participant.team.name}</span>
                  </div>
                )}
                
                <div>
                  <span className="font-medium text-gray-600">Achievements:</span>
                  <span className="ml-1 text-gray-900">{truncateText(participant.achievements)}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-600">Skills:</span>
                  <span className="ml-1 text-gray-900">{truncateText(participant.skills)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        {/* Pagination Info and Controls */}
        <div className="mb-4">
          {/* Mobile: Stack vertically */}
          <div className="flex flex-col gap-3 md:hidden">
            <div className="text-sm text-gray-600 text-center">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalParticipants)} to{' '}
              {Math.min(currentPage * itemsPerPage, totalParticipants)} of {totalParticipants} participants
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <span>Items per page:</span>
              <CustomDropdown
                value={itemsPerPage.toString()}
                onChange={(value) => {
                  setItemsPerPage(parseInt(value))
                  setCurrentPage(1)
                }}
                options={[
                  { value: '10', label: '10' },
                  { value: '15', label: '15' },
                  { value: '25', label: '25' },
                  { value: '50', label: '50' }
                ]}
                className="w-20"
              />
            </div>
            <div className="text-sm text-gray-600 text-center">
              Page {currentPage} of {totalPages}
            </div>
          </div>
          
          {/* Desktop: Single line */}
          <div className="hidden md:flex items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalParticipants)} to{' '}
                {Math.min(currentPage * itemsPerPage, totalParticipants)} of {totalParticipants} participants
              </span>
              <div className="flex items-center gap-2">
                <span>Items per page:</span>
                <CustomDropdown
                  value={itemsPerPage.toString()}
                  onChange={(value) => {
                    setItemsPerPage(parseInt(value))
                    setCurrentPage(1)
                  }}
                  options={[
                    { value: '10', label: '10' },
                    { value: '15', label: '15' },
                    { value: '25', label: '25' },
                    { value: '50', label: '50' }
                  ]}
                  className="w-20"
                />
              </div>
            </div>
            <div>
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-8 px-3 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              <ChevronLeft className="h-3 w-3" />
              Previous
            </Button>
            
            {/* Page numbers */}
            <div className="flex space-x-1 justify-center">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 p-0 ${
                      currentPage === pageNum 
                        ? 'bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400' 
                        : ''
                    }`}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            
            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-3 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              Next
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Participants