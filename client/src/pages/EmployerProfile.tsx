import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  MapPin, Mail, Phone, Edit, Plus, Building, Users, Globe, 
  DollarSign, Clock, Loader2, FileText, BarChart, X, Save,
  ExternalLink, Eye
} from "lucide-react"
import Navigation from "@/components/Navigation"
import { useState, useEffect } from "react"
import { 
  getEmployerProfile, 
  updateEmployerProfile, 
  uploadCompanyLogo,
  getEmployerJobs,
  createJob,
  updateJob,
  deleteJob
} from "@/services/apiClient"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CompanyProfile {
  id: number;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  company_name: string;
  industry: string;
  logo?: string;
  description: string;
  location: string;
  website: string;
  company_size: string;
  founded_year?: number;
  phone: string;
  email: string;
  linkedin: string;
  twitter: string;
  rating?: number | string | null;
  total_jobs_posted: number;
  created_at: string;
  updated_at: string;
  benefits?: string;
}

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  job_type: string;
  experience_level: string;
  salary_range: string;
  remote_option: string;
  requirements: string;
  responsibilities: string;
  qualifications: string;
  benefits: string;
  application_deadline?: string;
  application_instructions: string;
  is_active: boolean;
  is_featured: boolean;
  views_count: number;
  applications_count: number;
  posted_at: string;
  created_at: string;
  updated_at: string;
  skills_required: Array<{
    id: number;
    name: string;
  }>;
}

interface EditProfileData {
  company_name: string;
  industry: string;
  description: string;
  location: string;
  website: string;
  company_size: string;
  founded_year?: number;
  phone: string;
  email: string;
  linkedin: string;
  twitter: string;
  benefits?: string;
}

interface EditJobData {
  title: string;
  description: string;
  location: string;
  job_type: string;
  experience_level: string;
  salary_range: string;
  remote_option: string;
  requirements: string;
  responsibilities: string;
  qualifications: string;
  benefits: string;
  application_deadline?: string;
  application_instructions: string;
  is_active: boolean;
}

const EmployerProfile = () => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editData, setEditData] = useState<EditProfileData>({
    company_name: '',
    industry: '',
    description: '',
    location: '',
    website: '',
    company_size: '',
    phone: '',
    email: '',
    linkedin: '',
    twitter: '',
  })
  
  const [showJobDialog, setShowJobDialog] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [jobData, setJobData] = useState<EditJobData>({
    title: '',
    description: '',
    location: '',
    job_type: 'full_time',
    experience_level: 'mid',
    salary_range: '',
    remote_option: 'no',
    requirements: '',
    responsibilities: '',
    qualifications: '',
    benefits: '',
    application_instructions: '',
    is_active: true,
  })
  
  const { user } = useAuth()
  const navigate = useNavigate()

  // Load profile and jobs
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [profileData, jobsData] = await Promise.all([
          getEmployerProfile(),
          getEmployerJobs()
        ])
        
        setProfile(profileData)
        setJobs(jobsData.results || jobsData)
        
        // Initialize edit data
        setEditData({
          company_name: profileData.company_name,
          industry: profileData.industry,
          description: profileData.description,
          location: profileData.location,
          website: profileData.website,
          company_size: profileData.company_size,
          founded_year: profileData.founded_year,
          phone: profileData.phone,
          email: profileData.email,
          linkedin: profileData.linkedin,
          twitter: profileData.twitter,
          benefits: profileData.benefits || '',
        })
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)
      const updatedProfile = await updateEmployerProfile(editData)
      setProfile(updatedProfile)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    try {
      await uploadCompanyLogo(file)
      // Reload profile to get updated logo
      const profileData = await getEmployerProfile()
      setProfile(profileData)
    } catch (error) {
      console.error('Failed to upload logo:', error)
      alert('Failed to upload logo. Please try again.')
    }
  }

  const handleCreateJob = () => {
    setEditingJob(null)
    setJobData({
      title: '',
      description: '',
      location: '',
      job_type: 'full_time',
      experience_level: 'mid',
      salary_range: '',
      remote_option: 'no',
      requirements: '',
      responsibilities: '',
      qualifications: '',
      benefits: '',
      application_instructions: '',
      is_active: true,
    })
    setShowJobDialog(true)
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setJobData({
      title: job.title,
      description: job.description,
      location: job.location,
      job_type: job.job_type,
      experience_level: job.experience_level,
      salary_range: job.salary_range,
      remote_option: job.remote_option,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      qualifications: job.qualifications,
      benefits: job.benefits,
      application_deadline: job.application_deadline,
      application_instructions: job.application_instructions,
      is_active: job.is_active,
    })
    setShowJobDialog(true)
  }

  const handleSaveJob = async () => {
    try {
      if (editingJob) {
        await updateJob(editingJob.id, jobData)
      } else {
        await createJob(jobData)
      }
      
      // Reload jobs
      const jobsData = await getEmployerJobs()
      setJobs(jobsData.results || jobsData)
      setShowJobDialog(false)
      setEditingJob(null)
    } catch (error) {
      console.error('Failed to save job:', error)
      alert('Failed to save job. Please try again.')
    }
  }

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm('Are you sure you want to delete this job?')) return
    
    try {
      await deleteJob(jobId)
      // Remove job from list
      setJobs(jobs.filter(job => job.id !== jobId))
    } catch (error) {
      console.error('Failed to delete job:', error)
      alert('Failed to delete job. Please try again.')
    }
  }

  const handleViewApplications = (jobId: number) => {
    navigate(`/employer/jobs/${jobId}/applications`)
  }

  const getJobTypeLabel = (jobType: string) => {
    const types: Record<string, string> = {
      'full_time': 'Full Time',
      'part_time': 'Part Time',
      'contract': 'Contract',
      'freelance': 'Freelance',
      'internship': 'Internship',
      'temporary': 'Temporary',
    }
    return types[jobType] || jobType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getExperienceLabel = (experience: string) => {
    const levels: Record<string, string> = {
      'entry': 'Entry Level',
      'mid': 'Mid Level',
      'senior': 'Senior',
      'lead': 'Lead',
      'executive': 'Executive',
    }
    return levels[experience] || experience.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getRemoteLabel = (remote: string) => {
    const options: Record<string, string> = {
      'no': 'On-site Only',
      'yes': 'Remote Only',
      'hybrid': 'Hybrid',
    }
    return options[remote] || remote
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getInitials = (companyName: string) => {
    return companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const parseBenefits = (benefitsString: string) => {
    if (!benefitsString) return []
    try {
      return benefitsString.split('\n').filter(b => b.trim())
    } catch {
      return []
    }
  }

  const getRating = (): string => {
    if (!profile || profile.rating == null) {
      return '0.0';
    }
    
    try {
      // Convert rating to string first, then parse as float
      const ratingValue = typeof profile.rating === 'string' 
        ? parseFloat(profile.rating) 
        : Number(profile.rating);
      
      // Check if it's a valid number
      if (isNaN(ratingValue) || !isFinite(ratingValue)) {
        return '0.0';
      }
      
      // Format to 1 decimal place
      return ratingValue.toFixed(1);
    } catch (error) {
      console.warn('Error formatting rating:', error);
      return '0.0';
    }
  }

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Company Header */}
          <Card className="shadow-card mb-8">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 lg:w-32 lg:h-32 mx-auto sm:mx-0">
                      <AvatarImage src={profile.logo} alt={profile.company_name} />
                      <AvatarFallback className="text-xl lg:text-2xl">
                        {getInitials(profile.company_name)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div className="absolute bottom-0 right-0">
                        <input
                          type="file"
                          id="logo-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 rounded-full"
                          onClick={() => document.getElementById('logo-upload')?.click()}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center sm:text-left space-y-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="company_name">Company Name</Label>
                          <Input
                            id="company_name"
                            value={editData.company_name}
                            onChange={(e) => setEditData(prev => ({ ...prev, company_name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="industry">Industry</Label>
                          <Input
                            id="industry"
                            value={editData.industry}
                            onChange={(e) => setEditData(prev => ({ ...prev, industry: e.target.value }))}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
                          {profile.company_name}
                        </h1>
                        <p className="text-lg lg:text-xl text-primary font-medium mb-3">{profile.industry}</p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-muted-foreground text-sm lg:text-base">
                          <div className="flex items-center justify-center sm:justify-start">
                            <MapPin className="h-4 w-4 mr-2" />
                            {profile.location}
                          </div>
                          <div className="flex items-center justify-center sm:justify-start">
                            <Users className="h-4 w-4 mr-2" />
                            {profile.company_size}
                          </div>
                          {profile.founded_year && (
                            <div className="flex items-center justify-center sm:justify-start">
                              <Building className="h-4 w-4 mr-2" />
                              Founded {profile.founded_year}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 lg:gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{profile.total_jobs_posted}</div>
                        <div className="text-muted-foreground">Jobs Posted</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{jobs.filter(j => j.is_active).length}</div>
                        <div className="text-muted-foreground">Active Jobs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{getRating()}/5</div>
                        <div className="text-muted-foreground">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">
                          {jobs.reduce((total, job) => total + job.applications_count, 0)}
                        </div>
                        <div className="text-muted-foreground">Total Applicants</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      if (isEditing) {
                        setIsEditing(false)
                        // Reset edit data
                        setEditData({
                          company_name: profile.company_name,
                          industry: profile.industry,
                          description: profile.description,
                          location: profile.location,
                          website: profile.website,
                          company_size: profile.company_size,
                          founded_year: profile.founded_year,
                          phone: profile.phone,
                          email: profile.email,
                          linkedin: profile.linkedin,
                          twitter: profile.twitter,
                          benefits: profile.benefits || '',
                        })
                      } else {
                        setIsEditing(true)
                      }
                    }}
                    disabled={isSaving}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                  <Button 
                    className="bg-gradient-primary hover:opacity-90"
                    onClick={handleCreateJob}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Job
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Company */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-xl font-heading font-semibold text-foreground">
                    About {profile.company_name}
                  </h2>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea 
                      value={editData.description}
                      onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-32"
                      placeholder="Tell us about your company..."
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {profile.description || 'No description provided.'}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Open Positions */}
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-xl font-heading font-semibold text-foreground">
                    Open Positions ({jobs.filter(j => j.is_active).length})
                  </h2>
                  <Button variant="outline" size="sm" onClick={handleCreateJob}>
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Job
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {jobs.filter(j => j.is_active).length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No active job postings</p>
                      <Button variant="outline" className="mt-4" onClick={handleCreateJob}>
                        <Plus className="h-4 w-4 mr-2" />
                        Post Your First Job
                      </Button>
                    </div>
                  ) : (
                    jobs.filter(j => j.is_active).map((job) => (
                      <Card key={job.id} className="border border-border">
                        <CardContent className="p-4 lg:p-6">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-semibold text-foreground text-lg">{job.title}</h3>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                                  <Badge variant="outline">{getJobTypeLabel(job.job_type)}</Badge>
                                  <Badge variant="outline">{getExperienceLabel(job.experience_level)}</Badge>
                                  <Badge variant="outline">{getRemoteLabel(job.remote_option)}</Badge>
                                  {job.salary_range && (
                                    <div className="flex items-center">
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      {job.salary_range}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <p className="text-muted-foreground text-sm line-clamp-2">
                                {job.description}
                              </p>
                              
                              {job.skills_required && job.skills_required.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {job.skills_required.slice(0, 3).map((skill) => (
                                    <Badge key={skill.id} variant="secondary" className="text-xs">
                                      {skill.name}
                                    </Badge>
                                  ))}
                                  {job.skills_required.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{job.skills_required.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-end space-y-2 text-sm">
                              <div className="flex items-center text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                Posted {formatDate(job.posted_at)}
                              </div>
                              <div className="text-muted-foreground">
                                {job.applications_count} applicant{job.applications_count !== 1 ? 's' : ''}
                              </div>
                              <div className="text-muted-foreground">
                                <Eye className="h-3 w-3 mr-1 inline" />
                                {job.views_count} views
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEditJob(job)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="bg-gradient-primary hover:opacity-90"
                                  onClick={() => handleViewApplications(job.id)}
                                >
                                  <Users className="h-3 w-3 mr-1" />
                                  View ({job.applications_count})
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Archived Jobs */}
              {jobs.filter(j => !j.is_active).length > 0 && (
                <Card className="shadow-card">
                  <CardHeader>
                    <h2 className="text-xl font-heading font-semibold text-foreground">
                      Archived Positions ({jobs.filter(j => !j.is_active).length})
                    </h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {jobs.filter(j => !j.is_active).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <h4 className="font-medium text-foreground">{job.title}</h4>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>Posted {formatDate(job.posted_at)}</span>
                            <span>•</span>
                            <span>{job.applications_count} applicants</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditJob(job)}
                          >
                            Reactivate
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Benefits */}
              {(profile.benefits || isEditing) && (
                <Card className="shadow-card">
                  <CardHeader>
                    <h2 className="text-lg font-heading font-semibold text-foreground">
                      Benefits & Perks
                    </h2>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        value={editData.benefits || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, benefits: e.target.value }))}
                        placeholder="Enter benefits, one per line..."
                        className="min-h-32"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {parseBenefits(profile.benefits || '').length > 0 ? (
                          parseBenefits(profile.benefits || '').map((benefit, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {benefit}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No benefits listed</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Contact Information */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-lg font-heading font-semibold text-foreground">
                    Contact Information
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={editData.email}
                          onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={editData.phone}
                          onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={editData.website}
                          onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={editData.linkedin}
                          onChange={(e) => setEditData(prev => ({ ...prev, linkedin: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          value={editData.twitter}
                          onChange={(e) => setEditData(prev => ({ ...prev, twitter: e.target.value }))}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span className="text-sm">{profile.email}</span>
                      </div>
                      {profile.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span className="text-sm">{profile.phone}</span>
                        </div>
                      )}
                      {profile.website && (
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-3 text-muted-foreground" />
                          <a 
                            href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                            className="text-sm text-primary hover:underline" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                      {profile.linkedin && (
                        <div className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-3 text-muted-foreground" />
                          <a 
                            href={profile.linkedin} 
                            className="text-sm text-primary hover:underline" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            LinkedIn
                          </a>
                        </div>
                      )}
                      {profile.twitter && (
                        <div className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-3 text-muted-foreground" />
                          <a 
                            href={profile.twitter} 
                            className="text-sm text-primary hover:underline" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            Twitter
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-lg font-heading font-semibold text-foreground">Quick Actions</h2>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleCreateJob}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Job
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/employer/jobs')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Manage All Jobs
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/employer/applications')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View All Applicants
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/employer/analytics')}
                  >
                    <BarChart className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button 
                className="bg-gradient-primary hover:opacity-90" 
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Job Creation/Editing Dialog */}
      <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingJob ? 'Edit Job' : 'Post New Job'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={jobData.title}
                  onChange={(e) => setJobData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Senior Frontend Developer"
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={jobData.location}
                  onChange={(e) => setJobData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., San Francisco, CA or Remote"
                />
              </div>
              
              <div>
                <Label htmlFor="job_type">Job Type *</Label>
                <Select
                  value={jobData.job_type}
                  onValueChange={(value) => setJobData(prev => ({ ...prev, job_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="experience_level">Experience Level *</Label>
                <Select
                  value={jobData.experience_level}
                  onValueChange={(value) => setJobData(prev => ({ ...prev, experience_level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="remote_option">Remote Option *</Label>
                <Select
                  value={jobData.remote_option}
                  onValueChange={(value) => setJobData(prev => ({ ...prev, remote_option: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select remote option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">On-site Only</SelectItem>
                    <SelectItem value="yes">Remote Only</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="salary_range">Salary Range</Label>
                <Input
                  id="salary_range"
                  value={jobData.salary_range}
                  onChange={(e) => setJobData(prev => ({ ...prev, salary_range: e.target.value }))}
                  placeholder="e.g., $80,000 - $120,000"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={jobData.description}
                onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                className="min-h-32"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={jobData.requirements}
                  onChange={(e) => setJobData(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="List requirements (one per line)..."
                  className="min-h-24"
                />
              </div>
              
              <div>
                <Label htmlFor="benefits">Benefits & Perks</Label>
                <Textarea
                  id="benefits"
                  value={jobData.benefits}
                  onChange={(e) => setJobData(prev => ({ ...prev, benefits: e.target.value }))}
                  placeholder="List benefits (one per line)..."
                  className="min-h-24"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="application_instructions">Application Instructions</Label>
              <Textarea
                id="application_instructions"
                value={jobData.application_instructions}
                onChange={(e) => setJobData(prev => ({ ...prev, application_instructions: e.target.value }))}
                placeholder="Any special instructions for applicants..."
                className="min-h-24"
              />
            </div>
            
            <div>
              <Label htmlFor="application_deadline">Application Deadline (Optional)</Label>
              <Input
                id="application_deadline"
                type="date"
                value={jobData.application_deadline || ''}
                onChange={(e) => setJobData(prev => ({ ...prev, application_deadline: e.target.value }))}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={jobData.is_active}
                onChange={(e) => setJobData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="h-4 w-4"
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active (job will be visible to job seekers)
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJobDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90" onClick={handleSaveJob}>
              {editingJob ? 'Update Job' : 'Post Job'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EmployerProfile
