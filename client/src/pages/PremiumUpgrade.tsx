import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Target, Eye, TrendingUp } from "lucide-react"
import Navigation from "@/components/Navigation"

const PremiumUpgrade = () => {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      period: "",
      description: "Perfect for getting started",
      features: [
        "Create basic profile",
        "Browse listings",
        "Basic search filters",
        "Send 5 messages per month",
        "Standard support"
      ],
      buttonText: "Current Plan",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "For serious professionals",
      features: [
        "Enhanced profile with portfolio",
        "Unlimited messaging",
        "Advanced search filters",
        "Priority in search results",
        "Analytics dashboard",
        "Auto-suggestions for matches",
        "Email support"
      ],
      buttonText: "Upgrade Now",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Premium",
      price: "$99",
      period: "/month",
      description: "Maximum visibility and reach",
      features: [
        "Everything in Professional",
        "Featured profile placement",
        "Enhanced employer reach",
        "Premium investor access",
        "Priority job opportunities",
        "Advanced analytics",
        "1-on-1 strategy sessions",
        "24/7 priority support"
      ],
      buttonText: "Go Premium",
      buttonVariant: "default" as const,
      popular: false
    }
  ]

  const benefits = [
    {
      icon: Target,
      title: "Auto-Suggestions",
      description: "Get intelligent recommendations for job matches, investment opportunities, and collaboration partners based on your profile and preferences."
    },
    {
      icon: Eye,
      title: "Increased Visibility",
      description: "Boost your profile's visibility to employers, investors, and potential collaborators with priority placement in search results."
    },
    {
      icon: TrendingUp,
      title: "Enhanced Analytics",
      description: "Track your profile views, message responses, and application success rates with detailed analytics and insights."
    },
    {
      icon: Zap,
      title: "Priority Access",
      description: "Get early access to premium job opportunities, exclusive investor pitches, and high-profile collaboration requests."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Star className="h-4 w-4 mr-1" />
              Premium Features
            </Badge>
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
              Supercharge Your Success on Thryve
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Unlock premium features designed to accelerate your career growth, increase your visibility, 
              and connect you with the best opportunities in your field.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-heading font-bold text-center text-foreground mb-12">
              Why Go Premium?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="shadow-card text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-foreground">
                      {benefit.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="mb-16">
            <h2 className="text-3xl font-heading font-bold text-center text-foreground mb-12">
              Choose Your Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`shadow-card relative ${plan.popular ? 'ring-2 ring-primary shadow-card-hover' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-primary">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-muted-foreground">
                      {plan.description}
                    </p>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button 
                      className={`w-full ${plan.buttonVariant === 'default' ? 'bg-gradient-primary hover:opacity-90' : ''}`}
                      variant={plan.buttonVariant}
                      disabled={plan.buttonText === "Current Plan"}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Success Stories */}
          <div className="bg-muted/30 rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-heading font-bold text-center text-foreground mb-8">
              Success Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah K.",
                  role: "Frontend Developer",
                  story: "Within 2 weeks of upgrading to Premium, I landed my dream job at a top tech company. The enhanced visibility made all the difference!"
                },
                {
                  name: "Marcus T.",
                  role: "Digital Artist",
                  story: "Premium helped me connect with investors who funded my creative studio. The auto-suggestions feature found perfect matches I never would have discovered."
                },
                {
                  name: "Jennifer L.",
                  role: "Marketing Manager",
                  story: "The analytics dashboard showed me exactly how to optimize my profile. I saw a 300% increase in employer messages within the first month."
                }
              ].map((story, index) => (
                <Card key={index} className="shadow-card">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground italic mb-4">
                      "{story.story}"
                    </p>
                    <div>
                      <p className="font-semibold text-foreground">{story.name}</p>
                      <p className="text-sm text-muted-foreground">{story.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="text-center">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-8">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "Can I cancel my subscription anytime?",
                  answer: "Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. All payments are processed securely."
                },
                {
                  question: "Is there a money-back guarantee?",
                  answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with your premium experience, we'll refund your payment."
                }
              ].map((faq, index) => (
                <Card key={index} className="shadow-card text-left">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 px-8 py-3">
              Start Your Premium Journey Today
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No commitment • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PremiumUpgrade