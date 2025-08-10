import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Clock, DollarSign, Building, Users } from "lucide-react"
import SearchBar from "@/components/SearchBar"
import Navigation from "@/components/Navigation"

const JobListings = () => {
  // Mock data for job listings
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechFlow Solutions",
      companyLogo: "/placeholder.svg",
      location: "San Francisco, CA",
      type: "Full Time",
      salary: "$120K - $160K",
      posted: "2 days ago",
      description: "Join our team to build cutting-edge web applications using React, TypeScript, and modern development practices.",
      requirements: ["5+ years React experience", "TypeScript proficiency", "GraphQL knowledge", "Team leadership"],
      benefits: ["Health Insurance", "401k Match", "Remote Flexible", "Stock Options"],
      teamSize: "8-12 people",
      applicants: 24,
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "Creative Digital Agency",
      companyLogo: "/placeholder.svg",
      location: "New York, NY",
      type: "Full Time",
      salary: "$80K - $110K",
      posted: "1 day ago",
      description: "Create beautiful and intuitive user experiences for our diverse client portfolio across web and mobile platforms.",
      requirements: ["3+ years UX/UI experience", "Figma expertise", "User research skills", "Portfolio required"],
      benefits: ["Creative Freedom", "Learning Budget", "Flexible Hours", "Design Tools Stipend"],
      teamSize: "5-8 people",
      applicants: 18,
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "AI Innovations Corp",
      companyLogo: "/placeholder.svg",
      location: "Remote",
      type: "Full Time",
      salary: "$130K - $170K",
      posted: "3 days ago",
      description: "Work with large datasets to build machine learning models that drive business insights and product recommendations.",
      requirements: ["PhD or Masters in Data Science", "Python/R proficiency", "ML frameworks", "SQL expertise"],
      benefits: ["Remote First", "Conference Budget", "Latest Hardware", "Research Time"],
      teamSize: "4-6 people",
      applicants: 31,
    },
    {
      id: 4,
      title: "Marketing Manager",
      company: "Growth Marketing Hub",
      companyLogo: "/placeholder.svg",
      location: "Austin, TX",
      type: "Full Time",
      salary: "$70K - $95K",
      posted: "1 week ago",
      description: "Lead marketing campaigns and strategy to drive user acquisition and brand awareness for our B2B platform.",
      requirements: ["5+ years marketing experience", "B2B marketing", "Analytics tools", "Campaign management"],
      benefits: ["Marketing Budget", "Growth Opportunities", "Team Retreats", "Performance Bonuses"],
      teamSize: "3-5 people",
      applicants: 12,
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "CloudScale Technologies",
      companyLogo: "/placeholder.svg",
      location: "Seattle, WA",
      type: "Contract",
      salary: "$95K - $125K",
      posted: "4 days ago",
      description: "Build and maintain CI/CD pipelines, manage cloud infrastructure, and ensure scalable deployment processes.",
      requirements: ["AWS/Azure experience", "Docker/Kubernetes", "CI/CD pipelines", "Infrastructure as Code"],
      benefits: ["Cloud Certification", "Flexible Contract", "Latest Tools", "Remote Option"],
      teamSize: "6-10 people",
      applicants: 19,
    },
  ]

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
              showRoleFilter={false}
            />
          </div>

          {/* Job Cards */}
          <div className="space-y-6">
            {jobs.map((job) => (
              <Card key={job.id} className="shadow-card hover:shadow-card-hover transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={job.companyLogo} alt={job.company} />
                        <AvatarFallback>{job.company.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-heading font-semibold text-xl text-foreground mb-1">
                          {job.title}
                        </h3>
                        <div className="flex items-center space-x-1 text-primary font-medium mb-2">
                          <Building className="h-4 w-4" />
                          <span>{job.company}</span>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.type}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {job.teamSize}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-2">
                        {job.posted}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {job.applicants} applicants
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {job.description}
                  </p>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req) => (
                        <Badge key={req} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Benefits</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.benefits.map((benefit) => (
                        <Badge key={benefit} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    Save Job
                  </Button>
                  <Button className="bg-gradient-primary hover:opacity-90">
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Jobs
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default JobListings