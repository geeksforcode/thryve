
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Palette, Building, TrendingUp, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const roles = [
  {
    id: "job-seeker",
    title: "Job Seekers",
    description: "Find your dream job with personalized recommendations and direct connections to employers.",
    icon: Briefcase,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    features: ["Resume Builder", "Job Matching", "Interview Prep", "Career Guidance"]
  },
  {
    id: "artist",
    title: "Artists & Creatives",
    description: "Showcase your portfolio, connect with clients, and monetize your creative talents.",
    icon: Palette,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    features: ["Portfolio Showcase", "Client Matching", "Project Management", "Revenue Tracking"]
  },
  {
    id: "employer",
    title: "Employers",
    description: "Access top talent, post jobs, and build your dream team with our advanced matching system.",
    icon: Building,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    features: ["Talent Search", "Team Building", "Project Posting", "Hiring Analytics"]
  },
  {
    id: "investor",
    title: "Investors",
    description: "Discover promising talents and projects to invest in the future of creative work.",
    icon: TrendingUp,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    features: ["Deal Flow", "Talent Analytics", "Portfolio Tracking", "ROI Analysis"]
  }
];

const RoleCards = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you're looking for opportunities or providing them, we have the perfect platform for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, index) => (
            <Card 
              key={role.id} 
              className={`${role.bgColor} border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {role.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {role.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={`/signup?role=${role.id}`}>
                  <Button 
                    className={`w-full bg-gradient-to-r ${role.color} hover:opacity-90 group`}
                  >
                    Get Started
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleCards;
