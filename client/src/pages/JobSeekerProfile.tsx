import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Mail, Phone, Download, Edit, Plus, Star, Loader2 } from "lucide-react"
import Navigation from "@/components/Navigation"
import AddExperienceModal from "@/components/modals/AddExperienceModal"
import AddSkillsModal from "@/components/modals/AddSkillsModal"
import AddProjectModal from "@/components/modals/AddProjectModal"
import ContactModal from "@/components/modals/ContactModal"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { 
  getJobSeekerProfile, 
  updateJobSeekerProfile,
  uploadResume,
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  addSkills,
  removeSkill,
  uploadAvatar
} from "@/services/apiClient"
import { toast } from "sonner"

const JobSeekerProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [experiences, setExperiences] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [editForm, setEditForm] = useState({
    bio: '',
    title: '',
    location: '',
    phone: '',
    experience_level: 'entry'
  })
  const { user } = useAuth()

  // Fetch profile data
  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const [profileData, experienceData, projectData] = await Promise.all([
        getJobSeekerProfile(),
        getExperiences(),
        getProjects()
      ])
      
      setProfile(profileData)
      setExperiences(experienceData || [])
      setProjects(projectData || [])
      
      // Initialize edit form with current data
      setEditForm({
        bio: profileData.bio || '',
        title: profileData.title || '',
        location: profileData.location || '',
        phone: profileData.phone || '',
        experience_level: profileData.experience_level || 'entry'
      })
    } catch (error) {
      console.error('Error fetching profile data:', error)
      toast.error('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveChanges = async () => {
    try {
      setUpdating(true)
      const updatedProfile = await updateJobSeekerProfile(editForm)
      setProfile(updatedProfile)
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setUpdating(false)
    }
  }

  const handleAddExperience = async (experienceData: any) => {
    try {
      const newExperience = await addExperience(experienceData)
      setExperiences([...experiences, newExperience])
      toast.success('Experience added successfully')
    } catch (error) {
      console.error('Error adding experience:', error)
      toast.error('Failed to add experience')
    }
  }

  const handleDeleteExperience = async (id: number) => {
    try {
      await deleteExperience(id)
      setExperiences(experiences.filter(exp => exp.id !== id))
      toast.success('Experience deleted successfully')
    } catch (error) {
      console.error('Error deleting experience:', error)
      toast.error('Failed to delete experience')
    }
  }

  const handleAddProject = async (projectData: any) => {
    try {
      // Format data for your API
      const formattedData = {
        name: projectData.name,
        description: projectData.description,
        link: projectData.link || '',
        technologies: projectData.tech || []  // Note: your modal uses 'tech' field
      }
      const newProject = await addProject(formattedData)
      setProjects([...projects, newProject])
      toast.success('Project added successfully')
    } catch (error) {
      console.error('Error adding project:', error)
      toast.error('Failed to add project')
    }
  }

  const handleDeleteProject = async (id: number) => {
    try {
      await deleteProject(id)
      setProjects(projects.filter(project => project.id !== id))
      toast.success('Project deleted successfully')
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    }
  }

  const handleAddSkills = async (skills: string[]) => {
    try {
      await addSkills(skills)
      // Refresh profile to get updated skills
      const updatedProfile = await getJobSeekerProfile()
      setProfile(updatedProfile)
      toast.success('Skills added successfully')
    } catch (error) {
      console.error('Error adding skills:', error)
      toast.error('Failed to add skills')
    }
  }

  const handleRemoveSkill = async (skillName: string) => {  // CHANGE: skillName instead of id
    try {
      // Find the skill by name from the current profile
      const skillToRemove = profile.skills?.find((s: any) => s.name === skillName);
      if (skillToRemove && skillToRemove.id) {
        await removeSkill(skillToRemove.id);
        // Update local state immediately
        setProfile({
          ...profile,
          skills: profile.skills?.filter((s: any) => s.id !== skillToRemove.id) || []
        });
        toast.success('Skill removed successfully');
      } else {
        // If skill doesn't have an ID, filter by name
        setProfile({
          ...profile,
          skills: profile.skills?.filter((s: any) => s.name !== skillName) || []
        });
        toast.success('Skill removed from local state');
      }
    } catch (error) {
      console.error('Error removing skill:', error);
      toast.error('Failed to remove skill');
    }
  }

  const handleUploadResume = async (file: File) => {
    try {
      const result = await uploadResume(file)
      setProfile({...profile, resume: result.resume_url})
      toast.success('Resume uploaded successfully')
    } catch (error) {
      console.error('Error uploading resume:', error)
      toast.error('Failed to upload resume')
    }
  }

  const handleUploadAvatar = async (file: File) => {
    try {
      const result = await uploadAvatar(file)
      setProfile({...profile, avatar: result.avatar_url})
      toast.success('Avatar uploaded successfully')
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Failed to upload avatar')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 text-center">
          <p className="text-muted-foreground">No profile found</p>
        </div>
      </div>
    )
  }

  const userFullName = user ? `${user.first_name} ${user.last_name}` : 'User'
  const userEmail = user?.email || ''

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Profile Header */}
          <Card className="shadow-card mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-6">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profile.avatar} alt={userFullName} />
                    <AvatarFallback className="text-2xl">
                      {userFullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                        {userFullName}
                      </h1>
                      <p className="text-xl text-primary font-medium mb-3">{profile.title || 'Job Seeker'}</p>
                      
                      <div className="flex items-center space-x-6 text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {profile.location || 'Location not set'}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {userEmail}
                        </div>
                        {profile.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {profile.phone}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 mr-1 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{profile.rating || '0.0'}</span>
                        <span className="text-muted-foreground ml-1">
                          ({profile.review_count || 0} reviews)
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {profile.completed_projects || 0} projects completed
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={updating}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                  {profile.resume && (
                    <Button variant="outline" size="sm">
                      <a 
                        href={profile.resume} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Resume
                      </a>
                    </Button>
                  )}
                  <ContactModal 
                    recipientName={userFullName}
                    recipientType="job-seeker"
                    triggerText="Contact Me"
                  />
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-xl font-heading font-semibold text-foreground">About</h2>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea 
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      className="min-h-32"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">
                      {profile.bio || 'No bio provided'}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Experience */}
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-xl font-heading font-semibold text-foreground">Experience</h2>
                  {isEditing && (
                    <AddExperienceModal onAdd={handleAddExperience} />
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {experiences.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No experience added yet</p>
                  ) : (
                    experiences.map((exp) => (
                      <div key={exp.id} className="border-l-2 border-primary pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-foreground">{exp.title}</h3>
                            <p className="text-primary font-medium">{exp.company}</p>
                            <p className="text-sm text-muted-foreground mb-2">{exp.period}</p>
                            <p className="text-muted-foreground">{exp.description}</p>
                          </div>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteExperience(exp.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Projects */}
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-xl font-heading font-semibold text-foreground">Projects</h2>
                  {isEditing && (
                    <AddProjectModal onAdd={handleAddProject} />
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {projects.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No projects added yet</p>
                  ) : (
                    projects.map((project) => (
                      <div key={project.id} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-foreground mb-2">{project.name}</h3>
                            <p className="text-muted-foreground mb-3">{project.description}</p>
                            {/* CHANGE: Handle different data structures for technologies */}
                            {project.technologies && project.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {project.technologies.map((tech: any, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {typeof tech === 'string' ? tech : tech.name}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {project.link && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={project.link} target="_blank" rel="noopener noreferrer">
                                  View Project
                                </a>
                              </Button>
                            )}
                          </div>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skills */}
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-lg font-heading font-semibold text-foreground">Skills</h2>
                  {isEditing && (
                    <AddSkillsModal 
                      currentSkills={profile.skills?.map((s: any) => s.name) || []}
                      onAdd={handleAddSkills}
                      onRemove={handleRemoveSkill}  // Now this should work
                    />
                  )}
                </CardHeader>
                <CardContent>
                  {profile.skills && profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill: any) => (
                        <Badge key={skill.id} variant="secondary">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No skills added yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Resume Upload */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-lg font-heading font-semibold text-foreground">Resume</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Download className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    {profile.resume ? (
                      <>
                        <p className="text-sm text-muted-foreground mb-2">Current resume uploaded</p>
                        <a 
                          href={profile.resume} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          View Resume
                        </a>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground mb-2">No resume uploaded</p>
                    )}
                    {isEditing && (
                      <div className="mt-4">
                        <input
                          type="file"
                          id="resume-upload"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleUploadResume(file)
                          }}
                        />
                        <Label htmlFor="resume-upload">
                          <Button variant="outline" size="sm" asChild>
                            <span className="cursor-pointer">
                              {profile.resume ? 'Update Resume' : 'Upload Resume'}
                            </span>
                          </Button>
                        </Label>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Avatar Upload */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-lg font-heading font-semibold text-foreground">Profile Picture</h2>
                </CardHeader>
                <CardContent>
                  {isEditing && (
                    <div className="space-y-4">
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleUploadAvatar(file)
                        }}
                      />
                      <Label htmlFor="avatar-upload">
                        <Button variant="outline" size="sm" asChild>
                          <span className="cursor-pointer">
                            Upload New Picture
                          </span>
                        </Button>
                      </Label>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-lg font-heading font-semibold text-foreground">Contact Information</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Job Title</Label>
                        <Input 
                          id="title" 
                          value={editForm.title}
                          onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                          placeholder="e.g., Senior Frontend Developer"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location" 
                          value={editForm.location}
                          onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                          placeholder="e.g., San Francisco, CA"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <Input 
                          id="phone" 
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="experience_level">Experience Level</Label>
                        <select
                          id="experience_level"
                          value={editForm.experience_level}
                          onChange={(e) => setEditForm({...editForm, experience_level: e.target.value})}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        >
                          <option value="entry">Entry Level (0-2 years)</option>
                          <option value="mid">Mid Level (3-5 years)</option>
                          <option value="senior">Senior Level (6+ years)</option>
                          <option value="executive">Executive Level</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span className="text-sm">{userEmail}</span>
                      </div>
                      {profile.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span className="text-sm">{profile.phone}</span>
                        </div>
                      )}
                      {profile.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span className="text-sm">{profile.location}</span>
                        </div>
                      )}
                      {profile.experience_level && (
                        <div className="mt-4">
                          <Badge variant="outline">
                            {profile.experience_level === 'entry' && 'Entry Level'}
                            {profile.experience_level === 'mid' && 'Mid Level'}
                            {profile.experience_level === 'senior' && 'Senior Level'}
                            {profile.experience_level === 'executive' && 'Executive Level'}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 flex justify-end space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button 
                className="bg-gradient-primary hover:opacity-90" 
                onClick={handleSaveChanges}
                disabled={updating}
              >
                {updating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default JobSeekerProfile
