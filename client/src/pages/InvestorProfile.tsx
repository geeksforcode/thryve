import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Mail, Phone, Edit, DollarSign, TrendingUp, Building, Target, Users, Award } from "lucide-react"
import Navigation from "@/components/Navigation"
import ContactModal from "@/components/modals/ContactModal"
import { useState } from "react"

const InvestorProfile = () => {
  const [isEditing, setIsEditing] = useState(false)

  // Mock investor profile data
  const profile = {
    name: "Alexandra Chen",
    title: "Managing Partner",
    firm: "Innovation Ventures",
    avatar: "/placeholder.svg",
    location: "San Francisco, CA",
    email: "alexandra@innovationvc.com",
    phone: "+1 (555) 456-7890",
    bio: "Experienced venture capitalist with 12+ years in the tech industry. Passionate about supporting early-stage startups and emerging artists who are pushing creative boundaries through technology.",
    investmentRange: "$50K - $2M",
    focusAreas: ["Creative Tech", "Digital Art Platforms", "SaaS", "AI/ML", "Gaming", "EdTech"],
    investmentStage: ["Seed", "Series A", "Pre-Series A"],
    portfolioCompanies: [
      {
        name: "ArtFlow",
        description: "Digital art marketplace connecting artists with collectors",
        investment: "$500K",
        stage: "Series A",
        year: "2023",
        category: "Creative Tech"
      },
      {
        name: "SkillForge",
        description: "Platform for creative professionals to monetize their skills",
        investment: "$750K", 
        stage: "Seed",
        year: "2022",
        category: "Creator Economy"
      },
      {
        name: "TalentBridge",
        description: "AI-powered job matching for creative industries",
        investment: "$300K",
        stage: "Pre-Series A",
        year: "2023",
        category: "HR Tech"
      },
      {
        name: "StoryLabs",
        description: "Interactive storytelling platform for games and media",
        investment: "$1.2M",
        stage: "Series A",
        year: "2021",
        category: "Gaming"
      }
    ],
    achievements: [
      "Top 40 Under 40 VCs by TechCrunch",
      "3 successful exits totaling $120M",
      "Featured speaker at 15+ industry conferences",
      "Mentor at Y Combinator & Techstars"
    ],
    stats: {
      totalInvestments: 28,
      portfolioValue: "$45M",
      successfulExits: 8,
      avgTicketSize: "$650K"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Investor Header */}
          <Card className="shadow-card mb-8">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <Avatar className="w-24 h-24 lg:w-32 lg:h-32 mx-auto sm:mx-0">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="text-xl lg:text-2xl">{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center sm:text-left space-y-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
                        {profile.name}
                      </h1>
                      <p className="text-lg lg:text-xl text-primary font-medium mb-1">{profile.title}</p>
                      <p className="text-base lg:text-lg text-muted-foreground font-medium mb-3">{profile.firm}</p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-muted-foreground text-sm lg:text-base">
                        <div className="flex items-center justify-center sm:justify-start">
                          <MapPin className="h-4 w-4 mr-2" />
                          {profile.location}
                        </div>
                        <div className="flex items-center justify-center sm:justify-start">
                          <DollarSign className="h-4 w-4 mr-2" />
                          {profile.investmentRange}
                        </div>
                        <div className="flex items-center justify-center sm:justify-start">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          {profile.investmentStage.join(", ")}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 lg:gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{profile.stats.totalInvestments}</div>
                        <div className="text-muted-foreground">Investments</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{profile.stats.portfolioValue}</div>
                        <div className="text-muted-foreground">Portfolio Value</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{profile.stats.successfulExits}</div>
                        <div className="text-muted-foreground">Exits</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{profile.stats.avgTicketSize}</div>
                        <div className="text-muted-foreground">Avg Ticket</div>
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
                    recipientName={profile.name}
                    recipientType="investor"
                    triggerText="Connect"
                    triggerVariant="default"
                  />
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-xl font-heading font-semibold text-foreground">About</h2>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea 
                      defaultValue={profile.bio}
                      className="min-h-32"
                      placeholder="Tell us about your investment philosophy..."
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                  )}
                </CardContent>
              </Card>

              {/* Portfolio Companies */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-xl font-heading font-semibold text-foreground flex items-center">
                    <Building className="h-5 w-5 mr-2 text-primary" />
                    Portfolio Companies
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.portfolioCompanies.map((company, index) => (
                    <Card key={index} className="border border-border">
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-3 lg:space-y-0">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-foreground">{company.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {company.category}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {company.stage}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">{company.description}</p>
                          </div>
                          <div className="flex flex-col lg:items-end space-y-1 text-sm">
                            <span className="font-medium text-primary">{company.investment}</span>
                            <span className="text-muted-foreground">{company.year}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-xl font-heading font-semibold text-foreground flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary" />
                    Achievements & Recognition
                  </h2>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {profile.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Investment Focus */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-lg font-heading font-semibold text-foreground flex items-center">
                    <Target className="h-4 w-4 mr-2 text-primary" />
                    Investment Focus
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">FOCUS AREAS</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profile.focusAreas.map((area) => (
                          <Badge key={area} variant="secondary" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">INVESTMENT STAGE</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profile.investmentStage.map((stage) => (
                          <Badge key={stage} variant="outline" className="text-xs">
                            {stage}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">TICKET SIZE</Label>
                      <div className="mt-1">
                        <span className="font-medium text-primary">{profile.investmentRange}</span>
                      </div>
                    </div>
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

              {/* Quick Stats */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-lg font-heading font-semibold text-foreground">Investment Activity</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Companies Funded</span>
                    <span className="font-semibold">{profile.stats.totalInvestments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Successful Exits</span>
                    <span className="font-semibold">{profile.stats.successfulExits}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="font-semibold text-green-600">
                      {Math.round((profile.stats.successfulExits / profile.stats.totalInvestments) * 100)}%
                    </span>
                  </div>
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

export default InvestorProfile