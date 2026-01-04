import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Clock, DollarSign, Building, Users, Loader2, Bookmark, Eye, ExternalLink } from "lucide-react"
import SearchBar from "@/components/SearchBar"
import Navigation from "@/components/Navigation"
import { useState, useEffect } from "react"
import { getJobListings, saveJob, applyToJob, getJobListing } from "@/services/apiClient"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  employer: {
    id: number;
    company_name: string;
    industry: string;
    logo?: string;
    description?: string;
    location: string;
    website: string;
    company_size: string;
    rating: number;
  };
  skills_required: Array<{
    id: number;
    name: string;
  }>;
}

interface ApplicationData {
  cover_letter: string;
  resume?: File;
  portfolio_url: string;
  additional_info: string;
}

const JobListings = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchParams, setSearchParams] = useState({
    search: '',
    job_type: '',
    skills: [] as string[],
    location: '',
    experience_level: '',
    remote_option: '',
    ordering: '-posted_at'
  })
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [savedJobs, setSavedJobs] = useState<number[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showApplyDialog, setShowApplyDialog] = useState(false)
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    cover_letter: '',
    portfolio_url: '',
    additional_info: ''
  })
  const [isApplying, setIsApplying] = useState(false)
  const [jobDetail, setJobDetail] = useState<Job | null>(null)
  const [showJobDetail, setShowJobDetail] = useState(false)
  const { user, isAuthenticated } = useAuth()

  // Load jobs
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true)
        const response = await getJobListings({
          ...searchParams,
          page
        })
        
        if (response.results) {
          setJobs(response.results)
          setHasMore(!!response.next)
        } else {
          setJobs(response)
          setHasMore(false)
        }
      } catch (error) {
        console.error('Failed to load jobs:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadJobs()
  }, [searchParams, page])

  const handleSearch = (query: string, filterValues: any) => {
    setSearchParams(prev => ({
      ...prev,
      search: query,
      job_type: filterValues.jobType || '',
      skills: filterValues.skills ? [filterValues.skills] : [],
      location: filterValues.location || '',
      experience_level: filterValues.experience || '',
      remote_option: filterValues.remote || '',
      ordering: filterValues.ordering || '-posted_at'
    }))
    setPage(1)
  }

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true)
      const nextPage = page + 1
      const response = await getJobListings({
        ...searchParams,
        page: nextPage
      })
      
      if (response.results) {
        setJobs(prev => [...prev, ...response.results])
        setPage(nextPage)
        setHasMore(!!response.next)
      }
    } catch (error) {
      console.error('Failed to load more jobs:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  const handleSaveJob = async (jobId: number) => {
    if (!isAuthenticated) {
      window.location.href = '/auth?redirect=' + encodeURIComponent('/listings/jobs')
      return
    }
    
    try {
      await saveJob(jobId)
      if (savedJobs.includes(jobId)) {
        setSavedJobs(prev => prev.filter(id => id !== jobId))
      } else {
        setSavedJobs(prev => [...prev, jobId])
      }
    } catch (error) {
      console.error('Failed to save job:', error)
      alert('Failed to save job. Please try again.')
    }
  }

  const handleViewJob = async (jobId: number) => {
    try {
      const job = await getJobListing(jobId)
      setJobDetail(job)
      setShowJobDetail(true)
    } catch (error) {
      console.error('Failed to load job details:', error)
    }
  }

  const handleApplyJob = (job: Job) => {
    if (!isAuthenticated) {
      window.location.href = '/auth?redirect=' + encodeURIComponent('/listings/jobs')
      return
    }
    
    setSelectedJob(job)
    setApplicationData({
      cover_letter: '',
      portfolio_url: '',
      additional_info: ''
    })
    setShowApplyDialog(true)
  }

  const handleSubmitApplication = async () => {
    if (!selectedJob) return
    
    try {
      setIsApplying(true)
      const formData = new FormData()
      
      formData.append('cover_letter', applicationData.cover_letter)
      if (applicationData.resume) {
        formData.append('resume', applicationData.resume)
      }
      formData.append('portfolio_url', applicationData.portfolio_url)
      formData.append('additional_info', applicationData.additional_info)
      
      await applyToJob(selectedJob.id, formData)
      alert('Application submitted successfully!')
      setShowApplyDialog(false)
      setSelectedJob(null)
      
      // Refresh jobs to update applicant count
      const response = await getJobListings(searchParams)
      if (response.results) {
        setJobs(response.results)
      }
    } catch (error: any) {
      console.error('Failed to apply:', error)
      alert(error.message || 'Failed to submit application. Please try again.')
    } finally {
      setIsApplying(false)
    }
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
      'no': 'On-site',
      'yes': 'Remote',
      'hybrid': 'Hybrid',
    }
    return options[remote] || remote
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getInitials = (companyName: string) => {
    return companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const parseList = (text: string) => {
    if (!text) return []
    return text.split('\n').filter(item => item.trim())
  }

  if (loading) {
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
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
              Job Opportunities
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover your next career opportunity with top companies
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar 
              placeholder="Search for jobs by title, company, or skills..."
              showJobTypeFilter={true}
              showSkillsFilter={true}
              showLocationFilter={true}
              showExperienceFilter={true}
              showRemoteFilter={true}
              onSearch={handleSearch}
            />
          </div>

          {/* Active Filters */}
          {(searchParams.search || searchParams.job_type || searchParams.location || searchParams.experience_level || searchParams.remote_option) && (
            <div className="mb-6 flex flex-wrap gap-2">
              {searchParams.search && (
                <Badge variant="secondary" className="px-3 py-1">
                  Search: {searchParams.search}
                  <button 
                    onClick={() => setSearchParams(prev => ({ ...prev, search: '' }))}
                    className="ml-2 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {searchParams.job_type && (
                <Badge variant="secondary" className="px-3 py-1">
                  Job Type: {getJobTypeLabel(searchParams.job_type)}
                  <button 
                    onClick={() => setSearchParams(prev => ({ ...prev, job_type: '' }))}
                    className="ml-2 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {searchParams.location && (
                <Badge variant="secondary" className="px-3 py-1">
                  Location: {searchParams.location}
                  <button 
                    onClick={() => setSearchParams(prev => ({ ...prev, location: '' }))}
                    className="ml-2 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {searchParams.experience_level && (
                <Badge variant="secondary" className="px-3 py-1">
                  Experience: {getExperienceLabel(searchParams.experience_level)}
                  <button 
                    onClick={() => setSearchParams(prev => ({ ...prev, experience_level: '' }))}
                    className="ml-2 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {searchParams.remote_option && (
                <Badge variant="secondary" className="px-3 py-1">
                  Remote: {getRemoteLabel(searchParams.remote_option)}
                  <button 
                    onClick={() => setSearchParams(prev => ({ ...prev, remote_option: '' }))}
                    className="ml-2 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Job Cards */}
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                No jobs found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSearchParams({
                  search: '',
                  job_type: '',
                  skills: [],
                  location: '',
                  experience_level: '',
                  remote_option: '',
                  ordering: '-posted_at'
                })}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {jobs.map((job) => (
                  <Card key={job.id} className="shadow-card hover:shadow-card-hover transition-smooth">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-16 h-16 border border-border">
                            <AvatarImage src={job.employer.logo} alt={job.employer.company_name} />
                            <AvatarFallback>{getInitials(job.employer.company_name)}</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <h3 className="font-heading font-semibold text-xl text-foreground mb-1">
                              {job.title}
                            </h3>
                            <div className="flex items-center space-x-1 text-primary font-medium mb-2">
                              <Building className="h-4 w-4" />
                              <span>{job.employer.company_name}</span>
                              {job.employer.rating > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                  {job.employer.rating.toFixed(1)} ★
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="truncate">
                                  {job.location}
                                </span>
                                {job.remote_option !== 'no' && (
                                  <>
                                    <span className="mx-1">•</span>
                                    <Badge variant="outline" className="text-xs">
                                      {getRemoteLabel(job.remote_option)}
                                    </Badge>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                                {getJobTypeLabel(job.job_type)}
                              </div>
                              {job.salary_range && (
                                <div className="flex items-center">
                                  <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
                                  {job.salary_range}
                                </div>
                              )}
                              {job.experience_level && (
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                                  {getExperienceLabel(job.experience_level)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <div>
                            <Badge variant="secondary" className="mb-1">
                              {formatDate(job.posted_at)}
                            </Badge>
                            {job.application_deadline && (
                              <div className="text-xs text-muted-foreground">
                                Apply by: {new Date(job.application_deadline).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-end space-x-2">
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {job.views_count || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {job.applications_count || 0} applicants
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground line-clamp-2">
                        {job.description}
                      </p>
                      
                      {job.skills_required && job.skills_required.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Skills Required</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.skills_required.slice(0, 6).map((skill) => (
                              <Badge key={skill.id} variant="outline" className="text-xs">
                                {skill.name}
                              </Badge>
                            ))}
                            {job.skills_required.length > 6 && (
                              <Badge variant="outline" className="text-xs">
                                +{job.skills_required.length - 6} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {job.requirements && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Requirements</h4>
                          <div className="flex flex-wrap gap-2">
                            {parseList(job.requirements).slice(0, 4).map((req, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                            {parseList(job.requirements).length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{parseList(job.requirements).length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {job.benefits && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Benefits</h4>
                          <div className="flex flex-wrap gap-2">
                            {parseList(job.benefits).slice(0, 4).map((benefit, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                            {parseList(job.benefits).length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{parseList(job.benefits).length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex justify-between">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSaveJob(job.id)}
                          className={savedJobs.includes(job.id) ? "border-primary text-primary" : ""}
                        >
                          <Bookmark className={`h-4 w-4 mr-2 ${savedJobs.includes(job.id) ? "fill-primary" : ""}`} />
                          {savedJobs.includes(job.id) ? 'Saved' : 'Save Job'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewJob(job.id)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                      <Button 
                        className="bg-gradient-primary hover:opacity-90"
                        onClick={() => handleApplyJob(job)}
                        disabled={!job.is_active}
                      >
                        {!job.is_active ? 'Closed' : 'Apply Now'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center mt-12">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More Jobs'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Stats */}
          {jobs.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
              <p>Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''} • Updated just now</p>
            </div>
          )}
        </div>
      </main>

      {/* Job Detail Dialog */}
      <Dialog open={showJobDetail} onOpenChange={setShowJobDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
          </DialogHeader>
          
          {jobDetail && (
            <div className="space-y-6 py-4">
              <div className="flex items-start space-x-4">
                <Avatar className="w-20 h-20 border border-border">
                  <AvatarImage src={jobDetail.employer.logo} alt={jobDetail.employer.company_name} />
                  <AvatarFallback>{getInitials(jobDetail.employer.company_name)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {jobDetail.title}
                  </h2>
                  <div className="flex items-center space-x-2 text-primary font-medium mb-3">
                    <Building className="h-4 w-4" />
                    <span>{jobDetail.employer.company_name}</span>
                    {jobDetail.employer.rating > 0 && (
                      <Badge variant="secondary">
                        {jobDetail.employer.rating.toFixed(1)} ★
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {jobDetail.location}
                      {jobDetail.remote_option !== 'no' && (
                        <Badge variant="outline" className="ml-2">
                          {getRemoteLabel(jobDetail.remote_option)}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {getJobTypeLabel(jobDetail.job_type)}
                    </div>
                    {jobDetail.salary_range && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {jobDetail.salary_range}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {getExperienceLabel(jobDetail.experience_level)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Job Description</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {jobDetail.description}
                    </p>
                  </div>
                  
                  {jobDetail.responsibilities && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Responsibilities</h3>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {parseList(jobDetail.responsibilities).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {jobDetail.requirements && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Requirements</h3>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {parseList(jobDetail.requirements).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {jobDetail.qualifications && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Qualifications</h3>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {parseList(jobDetail.qualifications).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {jobDetail.skills_required && jobDetail.skills_required.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Skills Required</h3>
                      <div className="flex flex-wrap gap-2">
                        {jobDetail.skills_required.map((skill) => (
                          <Badge key={skill.id} variant="secondary">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold text-foreground">Company Info</h3>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Industry</p>
                        <p className="font-medium">{jobDetail.employer.industry}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Company Size</p>
                        <p className="font-medium">{jobDetail.employer.company_size}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{jobDetail.employer.location}</p>
                      </div>
                      {jobDetail.employer.website && (
                        <div>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <a href={jobDetail.employer.website} target="_blank" rel="noopener noreferrer">
                              <Globe className="h-4 w-4 mr-2" />
                              Visit Website
                            </a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold text-foreground">Job Stats</h3>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Posted</p>
                        <p className="font-medium">{formatDate(jobDetail.posted_at)}</p>
                      </div>
                      {jobDetail.application_deadline && (
                        <div>
                          <p className="text-sm text-muted-foreground">Application Deadline</p>
                          <p className="font-medium">
                            {new Date(jobDetail.application_deadline).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Views</p>
                        <p className="font-medium">{jobDetail.views_count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Applicants</p>
                        <p className="font-medium">{jobDetail.applications_count}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {jobDetail.benefits && (
                    <Card>
                      <CardHeader>
                        <h3 className="font-semibold text-foreground">Benefits & Perks</h3>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {parseList(jobDetail.benefits).map((benefit, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
              
              {jobDetail.application_instructions && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Application Instructions</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {jobDetail.application_instructions}
                  </p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJobDetail(false)}>
              Close
            </Button>
            <Button 
              className="bg-gradient-primary hover:opacity-90"
              onClick={() => {
                setShowJobDetail(false)
                if (jobDetail) {
                  handleApplyJob(jobDetail)
                }
              }}
              disabled={jobDetail && !jobDetail.is_active}
            >
              {jobDetail && !jobDetail.is_active ? 'Position Closed' : 'Apply Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Apply to {selectedJob?.title} at {selectedJob?.employer.company_name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div>
              <Label htmlFor="cover_letter">Cover Letter *</Label>
              <Textarea
                id="cover_letter"
                value={applicationData.cover_letter}
                onChange={(e) => setApplicationData(prev => ({ ...prev, cover_letter: e.target.value }))}
                placeholder="Tell us why you're interested in this position..."
                className="min-h-32"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="portfolio_url">Portfolio URL (Optional)</Label>
              <Input
                id="portfolio_url"
                type="url"
                value={applicationData.portfolio_url}
                onChange={(e) => setApplicationData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                placeholder="https://yourportfolio.com"
              />
            </div>
            
            <div>
              <Label htmlFor="resume">Resume (Optional)</Label>
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setApplicationData(prev => ({ 
                  ...prev, 
                  resume: e.target.files?.[0] 
                }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Accepted formats: PDF, DOC, DOCX
              </p>
            </div>
            
            <div>
              <Label htmlFor="additional_info">Additional Information (Optional)</Label>
              <Textarea
                id="additional_info"
                value={applicationData.additional_info}
                onChange={(e) => setApplicationData(prev => ({ ...prev, additional_info: e.target.value }))}
                placeholder="Any additional information you'd like to share..."
                className="min-h-24"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyDialog(false)} disabled={isApplying}>
              Cancel
            </Button>
            <Button 
              className="bg-gradient-primary hover:opacity-90" 
              onClick={handleSubmitApplication}
              disabled={isApplying || !applicationData.cover_letter}
            >
              {isApplying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default JobListings
