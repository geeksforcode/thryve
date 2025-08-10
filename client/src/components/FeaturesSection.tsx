import { Search, Shield, Zap, Heart, Globe, Star } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Smart Matching",
    description: "AI-powered algorithms connect you with the perfect opportunities or talent based on skills, experience, and preferences."
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Your data and transactions are protected with enterprise-grade security and privacy controls."
  },
  {
    icon: Zap,
    title: "Instant Connections",
    description: "Real-time messaging and notifications keep you connected with opportunities as they happen."
  },
  {
    icon: Heart,
    title: "Community Driven",
    description: "Join a supportive community where talent thrives and meaningful professional relationships are built."
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Access opportunities and talent from around the world, breaking down geographical barriers."
  },
  {
    icon: Star,
    title: "Quality Assured",
    description: "Verified profiles and ratings ensure you're connecting with legitimate, high-quality professionals."
  }
]

const FeaturesSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-6">
            Why Choose Thryve?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We've built the most comprehensive platform for connecting talent across industries. 
            Here's what makes us different.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div 
                key={index}
                className="group text-center p-6 rounded-2xl hover:bg-secondary/50 transition-smooth"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-card group-hover:shadow-card-hover transition-smooth">
                  <IconComponent className="h-8 w-8 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="font-heading font-semibold text-xl text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection