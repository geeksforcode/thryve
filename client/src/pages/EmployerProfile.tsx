import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Mail, Phone, Edit, Plus, Building, Users, Globe, DollarSign, Clock } from "lucide-react"
import Navigation from "@/components/Navigation"
import ContactModal from "@/components/modals/ContactModal"
import { useState } from "react"

const EmployerProfile = () => {
  const [isEditing, setIsEditing] = useState(false)

  // Mock company profile data
  const profile = {
    companyName: "TechFlow Solutions",
    industry: "Software Development",
    logo: "/placeholder.svg",
    location: "San Francisco, CA",
    website: "https://techflowsolutions.com",
    email: "careers@techflowsolutions.com",
    phone: "+1 (555) 123-4567",
    description: "TechFlow Solutions is a leading software development company specializing in cutting-edge web applications, mobile solutions, and enterprise software. We're passionate about creating innovative technology that drives business success.",
    companySize: "50-100 employees",
    founded: "2018",
    benefits: ["Health Insurance", "401k Match", "Remote Flexible", "Stock Options", "Learning Budget", "Unlimited PTO"],
    openJobs: [
      {
        id: 1,
        title: "Senior Frontend Developer",
        department: "Engineering",
        type: "Full Time",
        salary: "$120K - $160K",
        posted: "2 days ago",
        applicants: 24,
        description: "Join our team to build cutting-edge web applications using React, TypeScript, and modern development practices.",
        requirements: ["5+ years React experience", "TypeScript proficiency", "GraphQL knowledge", "Team leadership"]
      },
      {
        id: 2,
        title: "UX/UI Designer",
        department: "Design",
        type: "Full Time", 
        salary: "$90K - $120K",
        posted: "1 week ago",
        applicants: 18,
        description: "Create beautiful and intuitive user experiences for our diverse client portfolio.",
        requirements: ["3+ years UX/UI experience", "Figma expertise", "User research skills", "Portfolio required"]
      },
      {
        id: 3,
        title: "DevOps Engineer",
        department: "Engineering",
        type: "Contract",
        salary: "$95K - $125K",
        posted: "3 days ago",
        applicants: 12,
        description: "Build and maintain CI/CD pipelines, manage cloud infrastructure.",
        requirements: ["AWS/Azure experience", "Docker/Kubernetes", "CI/CD pipelines", "Infrastructure as Code"]
      }
    ],
    stats: {
      totalEmployees: 87,
      openPositions: 12,
      avgSalary: "$110K",
      rating: 4.6
    }
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
                  <Avatar className="w-24 h-24 lg:w-32 lg:h-32 mx-auto sm:mx-0">
                    <AvatarImage src={profile.logo} alt={profile.companyName} />
                    <AvatarFallback className="text-xl lg:text-2xl">{profile.companyName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center sm:text-left space-y-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
                        {profile.companyName}
                      </h1>
                      <p className="text-lg lg:text-xl text-primary font-medium mb-3">{profile.industry}</p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-muted-foreground text-sm lg:text-base">
                        <div className="flex items-center justify-center sm:justify-start">
                          <MapPin className="h-4 w-4 mr-2" />
                          {profile.location}
                        </div>
                        <div className="flex items-center justify-center sm:justify-start">
                          <Users className="h-4 w-4 mr-2" />
                          {profile.companySize}
                        </div>
                        <div className="flex items-center justify-center sm:justify-start">
                          <Building className="h-4 w-4 mr-2" />
                          Founded {profile.founded}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 lg:gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{profile.stats.totalEmployees}</div>
                        <div className="text-muted-foreground">Employees</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{profile.stats.openPositions}</div>
                        <div className="text-muted-foreground">Open Jobs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{profile.stats.avgSalary}</div>
                        <div className="text-muted-foreground">Avg Salary</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{profile.stats.rating}/5</div>
                        <div className="text-muted-foreground">Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                  <ContactModal 
                    recipientName={profile.companyName}
                    recipientType="employer"
                    triggerText="Contact Us"
                    triggerVariant="default"
                  />
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
                  <h2 className="text-xl font-heading font-semibold text-foreground">About {profile.companyName}</h2>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea 
                      defaultValue={profile.description}
                      className="min-h-32"
                      placeholder="Tell us about your company..."
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">{profile.description}</p>
                  )}
                </CardContent>
              </Card>

              {/* Open Positions */}
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-xl font-heading font-semibold text-foreground">Open Positions</h2>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Post New Job
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {profile.openJobs.map((job) => (
                    <Card key={job.id} className="border border-border">
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold text-foreground text-lg">{job.title}</h3>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span>{job.department}</span>
                                <span>•</span>
                                <span>{job.type}</span>
                                <span>•</span>
                                <div className="flex items-center">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  {job.salary}
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground text-sm">{job.description}</p>
                            
                            <div className="flex flex-wrap gap-2">
                              {job.requirements.slice(0, 3).map((req) => (
                                <Badge key={req} variant="outline" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                              {job.requirements.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{job.requirements.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {job.posted}
                            </div>
                            <div className="text-muted-foreground">
                              {job.applicants} applicants
                            </div>
                            <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                              View Job
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Benefits */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-lg font-heading font-semibold text-foreground">Benefits & Perks</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.benefits.map((benefit) => (
                      <Badge key={benefit} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
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
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" defaultValue={profile.website} />
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
                        <Globe className="h-4 w-4 mr-3 text-muted-foreground" />
                        <a href={profile.website} className="text-sm text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                          Visit Website
                        </a>
                      </div>
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
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Job
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    View Applicants
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Building className="h-4 w-4 mr-2" />
                    Company Analytics
                  </Button>
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

export default EmployerProfile