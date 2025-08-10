import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Eye, Heart } from "lucide-react"
import SearchBar from "@/components/SearchBar"
import Navigation from "@/components/Navigation"

const ArtistListings = () => {
  // Mock data for artists
  const artists = [
    {
      id: 1,
      name: "Elena Vasquez",
      avatar: "/placeholder.svg",
      specialty: "Digital Illustration",
      location: "Los Angeles, CA",
      bio: "Digital artist specializing in character design and concept art for games and animation.",
      portfolio: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      tags: ["Character Design", "Digital Art", "Game Art", "Concept Art"],
      likes: 1240,
      views: 8500,
      projectCount: 24,
    },
    {
      id: 2,
      name: "Marcus Thompson",
      avatar: "/placeholder.svg",
      specialty: "Photography",
      location: "New York, NY",
      bio: "Professional photographer focusing on portraits, events, and commercial work.",
      portfolio: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      tags: ["Portrait Photography", "Events", "Commercial", "Wedding"],
      likes: 890,
      views: 5200,
      projectCount: 18,
    },
    {
      id: 3,
      name: "Sophia Lee",
      avatar: "/placeholder.svg",
      specialty: "Graphic Design",
      location: "Toronto, ON",
      bio: "Brand designer creating memorable visual identities and marketing materials.",
      portfolio: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      tags: ["Branding", "Logo Design", "Print Design", "Web Design"],
      likes: 1560,
      views: 9800,
      projectCount: 32,
    },
    {
      id: 4,
      name: "James Wilson",
      avatar: "/placeholder.svg",
      specialty: "3D Modeling",
      location: "London, UK",
      bio: "3D artist and animator creating stunning visuals for film and advertising.",
      portfolio: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      tags: ["3D Modeling", "Animation", "VFX", "Rendering"],
      likes: 720,
      views: 4100,
      projectCount: 15,
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
              Artist Portfolios
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore creative talent and find the perfect artist for your project
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar 
              placeholder="Search for artists by name, specialty, or style..."
              showSkillsFilter={true}
              showRoleFilter={false}
            />
          </div>

          {/* Artist Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <Card key={artist.id} className="shadow-card hover:shadow-card-hover transition-smooth overflow-hidden">
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={artist.avatar} alt={artist.name} />
                    <AvatarFallback>{artist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <h3 className="font-heading font-semibold text-lg text-foreground">
                    {artist.name}
                  </h3>
                  <p className="text-primary font-medium">{artist.specialty}</p>
                  
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {artist.location}
                  </div>
                </CardHeader>

                {/* Portfolio Preview */}
                <div className="px-6 mb-4">
                  <div className="grid grid-cols-3 gap-2">
                    {artist.portfolio.map((image, index) => (
                      <div key={index} className="aspect-square bg-muted rounded-md overflow-hidden">
                        <img 
                          src={image} 
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 text-center">
                    {artist.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {artist.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {artist.likes}
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {artist.views}
                    </div>
                    <div className="text-xs">
                      {artist.projectCount} projects
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button className="w-full bg-gradient-primary hover:opacity-90">
                    View Portfolio
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Artists
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ArtistListings