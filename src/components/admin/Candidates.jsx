import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import candidates from '@/data/candidates'
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

const Candidates = () => {
  const [candidatesList, setCandidatesList] = useState(candidates)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    skill: '',
    experience: '',
    status: 'Available'
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

    // Create new candidate
    const newCandidate = {
      id: candidatesList.length + 1,
      name: formData.name,
      Skill: formData.skill,
      Experience: formData.experience,
      Status: formData.status
    }

    // Add to candidates list
    setCandidatesList(prev => [...prev, newCandidate])
    
    // Reset form and close sheet
    setFormData({ name: '', skill: '', experience: '', status: 'Available' })
    setIsSheetOpen(false)
  }

  const statusOptions = ['Available', 'Interviewing', 'Hired', 'On Hold', 'Rejected']
  const skillOptions = [
    'JavaScript', 'Python', 'Java', 'C#', 'C++', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
    'TypeScript', 'Kotlin', 'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask',
    'Spring Boot', 'Laravel', 'Express.js', 'Next.js', 'Nuxt.js', 'Flutter', 'React Native'
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Candidate Management</h2>
          <p className="text-muted-foreground">
            Here you can manage candidate registrations and their details.
          </p>
        </div>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Candidate
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
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidatesList.map((candidate) => (
          <div key={candidate.id} className="bg-card p-4 rounded-lg border shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg text-foreground">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {candidate.id}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                candidate.Status === 'Available' ? 'bg-green-100 text-green-800' :
                candidate.Status === 'Interviewing' ? 'bg-blue-100 text-blue-800' :
                candidate.Status === 'Hired' ? 'bg-purple-100 text-purple-800' :
                candidate.Status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {candidate.Status}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Skill:</span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                  {candidate.Skill}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Experience:</span>
                <span className="text-sm text-foreground">{candidate.Experience}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Candidates
