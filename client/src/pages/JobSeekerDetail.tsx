import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Loader2, MapPin, Briefcase, Calendar, ExternalLink, Mail, Phone, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navigation from "@/components/Navigation"
import { getJobSeekerDetail } from "@/services/apiClient"

interface JobSeekerDetail {
  id: number;
  user: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    date_joined: string;
  };
  title: string;
  location: string;
  experience_level: string;
  bio: string;
  rating: number;
  completed_projects: number;
  avatar?: string;
  resume?: string;
  website?: string;
  phone?: string;
  skills: Array<{
    id: number;
    name: string;
  }>;
  experiences: Array<{
    id: number;
    title: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string;
    current: boolean;
    description: string;
  }>;
  projects: Array<{
    id: number;
    title: string;
    description: string;
    technologies: string[];
    project_url?: string;
    start_date: string;
    end_date: string;
  }>;
}

const JobSeekerDetail = () => {
  const { username } = useParams<{ username: string }>()
  const [jobSeeker, setJobSeeker] = useState<JobSeekerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const loadJobSeeker = async () => {
      if (!username) return
      
      try {
        setLoading(true)
        const data = await getJobSeekerDetail(username)
        setJobSeeker(data)
      } catch (error) {
        console.error('Failed to load job seeker:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadJobSeeker()
  }, [username])

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
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

  if (!jobSeeker) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Job Seeker not found</h1>
          <Button asChild className="mt-4">
            <Link to="/job-seekers">Back to Listings</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link to="/job-seekers" className="flex items-center">
                ← Back to Job Seekers
              </Link>
            </Button>
          </div>

          {/* Header Section */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={jobSeeker.avatar || `/api/placeholder/96/96`} 
                    alt={`${jobSeeker.user.first_name} ${jobSeeker.user.last_name}`} />
                  <AvatarFallback>
                    {getInitials(jobSeeker.user.first_name, jobSeeker.user.last_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground">
                    {jobSeeker.user.first_name} {jobSeeker.user.last_name}
                  </h1>
                  <p className="text-primary text-xl font-medium">{jobSeeker.title}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {jobSeeker.location || 'Location not specified'}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {jobSeeker.experience_level}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Member since {formatDate(jobSeeker.user.date_joined)}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <Badge variant="secondary" className="px-3 py-1">
                      Rating: {jobSeeker.rating?.toFixed(1) || 'N/A'}
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                      Projects: {jobSeeker.completed_projects || 0}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {jobSeeker.resume && (
                    <Button variant="outline" asChild>
                      <a href={jobSeeker.resume} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Resume
                      </a>
                    </Button>
                  )}
                  <Button className="bg-gradient-primary">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {jobSeeker.bio || 'No bio provided.'}
                  </p>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {jobSeeker.skills.map((skill) => (
                        <Badge key={skill.id} variant="secondary" className="px-3 py-1">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience">
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  {jobSeeker.experiences.length === 0 ? (
                    <p className="text-muted-foreground">No experience listed.</p>
                  ) : (
                    <div className="space-y-6">
                      {jobSeeker.experiences.map((exp) => (
                        <div key={exp.id} className="border-l-2 border-primary pl-4">
                          <h3 className="text-lg font-semibold">{exp.title}</h3>
                          <p className="text-muted-foreground">{exp.company} • {exp.location}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(exp.start_date)} - {exp.current ? 'Present' : formatDate(exp.end_date)}
                          </p>
                          <p className="mt-2 text-muted-foreground whitespace-pre-line">
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {jobSeeker.projects.length === 0 ? (
                    <p className="text-muted-foreground">No projects listed.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {jobSeeker.projects.map((project) => (
                        <Card key={project.id}>
                          <CardHeader>
                            <CardTitle>{project.title}</CardTitle>
                            <CardDescription>
                              {formatDate(project.start_date)} - {formatDate(project.end_date)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-3">{project.description}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {project.technologies.map((tech, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                            {project.project_url && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  View Project
                                </a>
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-muted-foreground">{jobSeeker.user.email}</p>
                    </div>
                  </div>
                  
                  {jobSeeker.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-muted-foreground">{jobSeeker.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {jobSeeker.website && (
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Website</p>
                        <a 
                          href={jobSeeker.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {jobSeeker.website}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <Button className="bg-gradient-primary w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default JobSeekerDetail
