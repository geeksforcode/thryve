
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Palette, Building, TrendingUp, Search, MessageSquare, Shield, Award } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Search,
      title: "Talent Discovery",
      description: "Advanced AI-powered matching algorithms to find the perfect talent for your needs.",
      features: ["Smart matching", "Skill verification", "Portfolio reviews", "Background checks"]
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description: "Seamless communication tools to connect talent with opportunities.",
      features: ["Real-time messaging", "Video interviews", "Project collaboration", "File sharing"]
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Safe and secure payment processing for all transactions.",
      features: ["Escrow protection", "Multiple payment methods", "Automated invoicing", "Dispute resolution"]
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Comprehensive vetting and quality control for all participants.",
      features: ["Identity verification", "Skill assessments", "Review system", "Quality monitoring"]
    }
  ];

  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "Basic profile creation",
        "Limited job applications",
        "Standard support",
        "Basic search filters"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$19/month",
      description: "For serious professionals",
      features: [
        "Premium profile features",
        "Unlimited applications",
        "Priority support",
        "Advanced analytics",
        "Featured listings"
      ],
      cta: "Upgrade to Pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For teams and organizations",
      features: [
        "Team management",
        "Custom integrations",
        "Dedicated support",
        "Advanced reporting",
        "White-label options"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Comprehensive solutions for job seekers, artists, employers, and investors. 
            Everything you need to succeed in today's competitive market.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600">
              Powerful tools and features designed to accelerate your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Tailored for Your Role
            </h2>
            <p className="text-xl text-gray-600">
              Specialized features and tools for each type of user
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-blue-50 border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Job Seekers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li>• Resume builder</li>
                  <li>• Job matching</li>
                  <li>• Interview prep</li>
                  <li>• Career guidance</li>
                  <li>• Salary insights</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Artists
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li>• Portfolio showcase</li>
                  <li>• Client matching</li>
                  <li>• Project management</li>
                  <li>• Revenue tracking</li>
                  <li>• Creative tools</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Employers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li>• Talent search</li>
                  <li>• Team building</li>
                  <li>• Project posting</li>
                  <li>• Hiring analytics</li>
                  <li>• Candidate screening</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Investors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li>• Deal flow</li>
                  <li>• Talent analytics</li>
                  <li>• Portfolio tracking</li>
                  <li>• ROI analysis</li>
                  <li>• Market insights</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">
              Flexible pricing options to fit your needs and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`border-2 hover:shadow-xl transition-all ${
                plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'
              }`}>
                <CardHeader className="text-center">
                  {plan.popular && (
                    <div className="bg-blue-500 text-white text-sm font-medium py-1 px-3 rounded-full inline-block mb-4">
                      Most Popular
                    </div>
                  )}
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {plan.price}
                  </div>
                  <CardDescription className="text-gray-600">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
