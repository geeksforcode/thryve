import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Mail, Phone, Download, Edit, Plus, Star } from "lucide-react"
import Navigation from "@/components/Navigation"
import AddExperienceModal from "@/components/modals/AddExperienceModal"
import AddSkillsModal from "@/components/modals/AddSkillsModal"
import AddProjectModal from "@/components/modals/AddProjectModal"
import ContactModal from "@/components/modals/ContactModal"
import { useState } from "react"

const JobSeekerProfile = () => {
  const [isEditing, setIsEditing] = useState(false)

  // Mock profile data
  const profile = {
    name: "Sarah Johnson",
    title: "Senior Frontend Developer",
    avatar: "/placeholder.svg",
    location: "San Francisco, CA",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    bio: "Passionate frontend developer with 5+ years of experience building scalable web applications. I love creating intuitive user interfaces and working with modern technologies like React, TypeScript, and GraphQL.",
    skills: ["React", "TypeScript", "JavaScript", "Node.js", "GraphQL", "CSS", "Tailwind", "Redux"],
    experience: [
      {
        title: "Senior Frontend Developer",
        company: "TechCorp Inc",
        period: "2022 - Present",
        description: "Led frontend development for multiple projects, mentored junior developers, and implemented modern development practices."
      },
      {
        title: "Frontend Developer",
        company: "StartupXYZ",
        period: "2020 - 2022",
        description: "Built responsive web applications from scratch, collaborated with design and backend teams."
      },
      {
        title: "Junior Developer",
        company: "WebSolutions",
        period: "2019 - 2020",
        description: "Learned modern web development practices, contributed to various client projects."
      }
    ],
    projects: [
      {
        name: "E-commerce Platform",
        description: "Built a full-featured e-commerce platform with React and Node.js",
        tech: ["React", "Node.js", "MongoDB", "Stripe"],
        link: "https://github.com/sarah/ecommerce"
      },
      {
        name: "Task Management App",
        description: "Created a collaborative task management application",
        tech: ["React", "TypeScript", "Firebase"],
        link: "https://github.com/sarah/task-app"
      },
      {
        name: "Weather Dashboard",
        description: "Real-time weather dashboard with data visualization",
        tech: ["React", "D3.js", "Weather API"],
        link: "https://github.com/sarah/weather-dashboard"
      }
    ],
    rating: 4.9,
    completedProjects: 24,
    reviewCount: 18
  }

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
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="text-2xl">{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                        {profile.name}
                      </h1>
                      <p className="text-xl text-primary font-medium mb-3">{profile.title}</p>
                      
                      <div className="flex items-center space-x-6 text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {profile.location}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {profile.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {profile.phone}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 mr-1 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{profile.rating}</span>
                        <span className="text-muted-foreground ml-1">({profile.reviewCount} reviews)</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {profile.completedProjects} projects completed
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                  <ContactModal 
                    recipientName={profile.name}
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
                      defaultValue={profile.bio}
                      className="min-h-32"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                  )}
                </CardContent>
              </Card>

              {/* Experience */}
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-xl font-heading font-semibold text-foreground">Experience</h2>
                  {isEditing && (
                    <AddExperienceModal />
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <h3 className="font-semibold text-foreground">{exp.title}</h3>
                      <p className="text-primary font-medium">{exp.company}</p>
                      <p className="text-sm text-muted-foreground mb-2">{exp.period}</p>
                      <p className="text-muted-foreground">{exp.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Projects */}
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-xl font-heading font-semibold text-foreground">Projects</h2>
                  {isEditing && (
                    <AddProjectModal />
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {profile.projects.map((project, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold text-foreground mb-2">{project.name}</h3>
                      <p className="text-muted-foreground mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tech.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="outline" size="sm">
                        View Project
                      </Button>
                    </div>
                  ))}
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
                    <AddSkillsModal currentSkills={profile.skills} />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
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
                    <p className="text-sm text-muted-foreground mb-2">Current resume: resume.pdf</p>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        Upload New Resume
                      </Button>
                    )}
                  </div>
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
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue={profile.email} />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" defaultValue={profile.phone} />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" defaultValue={profile.location} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span className="text-sm">{profile.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span className="text-sm">{profile.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span className="text-sm">{profile.location}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button className="bg-gradient-primary hover:opacity-90" onClick={() => setIsEditing(false)}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default JobSeekerProfile