import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Palette, TrendingUp, Building2 } from "lucide-react"

const roles = [
  {
    id: "job-seeker",
    title: "Job Seeker",
    description: "Find your dream job with opportunities tailored to your skills and experience.",
    icon: Users,
    features: ["Personalized job matching", "Direct employer contact", "Resume optimization", "Interview prep tools"],
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "artist",
    title: "Artist",
    description: "Showcase your creative work and connect with clients who value artistic excellence.",
    icon: Palette,
    features: ["Portfolio showcasing", "Commission opportunities", "Creative collaboration", "Art market insights"],
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "investor",
    title: "Investor",
    description: "Discover promising talent and innovative projects to support and invest in.",
    icon: TrendingUp,
    features: ["Startup discovery", "Talent scouting", "Investment opportunities", "Market analytics"],
    color: "from-green-500 to-emerald-600"
  },
  {
    id: "employer",
    title: "Employer",
    description: "Find exceptional talent and build teams that drive your business forward.",
    icon: Building2,
    features: ["Talent acquisition", "Team building", "Skills assessment", "Hiring analytics"],
    color: "from-orange-500 to-red-500"
  }
]

const RoleSelection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-6">
            Choose Your Path
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join the community that matches your goals. Whether you're seeking opportunities 
            or looking to invest in talent, we've got you covered.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roles.map((role, index) => {
            const IconComponent = role.icon
            return (
              <Card 
                key={role.id} 
                className="role-card shadow-card border-0 overflow-hidden group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-4">
                  {/* Icon with gradient background */}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <CardTitle className="font-heading text-xl font-bold text-foreground">
                    {role.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {role.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features List */}
                  <ul className="space-y-2">
                    {role.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Action Buttons */}
                  <div className="pt-4 space-y-2">
                    <Button 
                      className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
                      size="sm"
                    >
                      Sign Up
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-muted-foreground hover:text-foreground"
                      size="sm"
                    >
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Not sure which path is right for you?
          </p>
          <Button variant="outline" size="lg" className="border-2 hover:bg-primary hover:text-primary-foreground transition-smooth">
            Take Our Quiz
          </Button>
        </div>
      </div>
    </section>
  )
}

export default RoleSelection