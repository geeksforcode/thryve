import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Briefcase, Star } from "lucide-react"
import SearchBar from "@/components/SearchBar"
import Navigation from "@/components/Navigation"

const JobSeekerListings = () => {
  // Mock data for job seekers
  const jobSeekers = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
      title: "Senior Frontend Developer",
      location: "San Francisco, CA",
      experience: "5+ years",
      skills: ["React", "TypeScript", "Node.js", "GraphQL"],
      rating: 4.9,
      summary: "Passionate frontend developer with expertise in modern web technologies and a track record of delivering high-quality applications.",
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/placeholder.svg",
      title: "UX/UI Designer",
      location: "New York, NY",
      experience: "3+ years",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      rating: 4.8,
      summary: "Creative designer focused on user-centered design with experience in both web and mobile applications.",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg",
      title: "Data Scientist",
      location: "Remote",
      experience: "4+ years",
      skills: ["Python", "Machine Learning", "SQL", "Tableau"],
      rating: 4.9,
      summary: "Data scientist with expertise in machine learning and predictive analytics, helping businesses make data-driven decisions.",
    },
    {
      id: 4,
      name: "David Kim",
      avatar: "/placeholder.svg",
      title: "Marketing Manager",
      location: "Chicago, IL",
      experience: "6+ years",
      skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
      rating: 4.7,
      summary: "Results-driven marketing professional with proven track record in growing brand awareness and customer acquisition.",
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
              Job Seeker Profiles
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover talented professionals ready to join your team
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar 
              placeholder="Search for job seekers by name, skills, or experience..."
              showSkillsFilter={true}
              showJobTypeFilter={true}
            />
          </div>

          {/* Job Seeker Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobSeekers.map((seeker) => (
              <Card key={seeker.id} className="shadow-card hover:shadow-card-hover transition-smooth">
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={seeker.avatar} alt={seeker.name} />
                    <AvatarFallback>{seeker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <h3 className="font-heading font-semibold text-lg text-foreground">
                    {seeker.name}
                  </h3>
                  <p className="text-primary font-medium">{seeker.title}</p>
                  
                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {seeker.location}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {seeker.experience}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                      {seeker.rating}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 text-center">
                    {seeker.summary}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    {seeker.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button className="w-full bg-gradient-primary hover:opacity-90">
                    View Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Profiles
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default JobSeekerListings