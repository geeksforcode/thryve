
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, DollarSign, Building, Users, Calendar, Bookmark } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Mock data - in a real app, this would come from an API
const opportunityDetails = {
  1: {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp Inc.",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $160k",
    postedTime: "2 days ago",
    description: "Join our team to build cutting-edge web applications using React, TypeScript, and modern development practices. We're looking for an experienced developer who can lead projects and mentor junior developers.",
    fullDescription: `We are seeking a Senior React Developer to join our innovative team at TechCorp Inc. In this role, you will be responsible for developing and maintaining high-quality web applications using the latest technologies.

Key Responsibilities:
• Design and develop responsive web applications using React, TypeScript, and modern JavaScript
• Collaborate with cross-functional teams including designers, product managers, and backend developers
• Mentor junior developers and provide technical guidance
• Participate in code reviews and maintain high coding standards
• Optimize applications for maximum speed and scalability
• Stay up-to-date with emerging technologies and industry best practices

What We Offer:
• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible work arrangements and remote-first culture
• Professional development budget for conferences and courses
• Modern tech stack and cutting-edge tools
• Collaborative and inclusive work environment`,
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Git", "Jest", "Docker"],
    applicants: 23,
    companyLogo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=60&h=60&fit=crop",
    companySize: "200-500 employees",
    industry: "Technology",
    benefits: ["Health Insurance", "Remote Work", "Flexible Hours", "Stock Options", "Learning Budget"],
    requirements: [
      "5+ years of experience with React and modern JavaScript",
      "Strong knowledge of TypeScript and ES6+",
      "Experience with state management libraries (Redux, Context API)",
      "Familiarity with testing frameworks (Jest, React Testing Library)",
      "Knowledge of RESTful APIs and GraphQL",
      "Experience with version control systems (Git)",
      "Bachelor's degree in Computer Science or equivalent experience"
    ]
  }
};

const OpportunityDetail = () => {
  const { id } = useParams();
  const opportunity = opportunityDetails[id as keyof typeof opportunityDetails];

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="py-20 px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Opportunity Not Found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={opportunity.companyLogo}
                    alt={opportunity.company}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {opportunity.title}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Building className="w-5 h-5 mr-2" />
                      {opportunity.company}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {opportunity.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {opportunity.salary}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {opportunity.postedTime}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Apply Now
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline">{opportunity.type}</Badge>
                <Badge variant="secondary">{opportunity.industry}</Badge>
                <Badge variant="secondary">{opportunity.companySize}</Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                    <div className="prose prose-gray max-w-none">
                      {opportunity.fullDescription.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                    <ul className="space-y-2">
                      {opportunity.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Company Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {opportunity.companySize}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="w-4 h-4 mr-2" />
                        {opportunity.industry}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Posted {opportunity.postedTime}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {opportunity.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-700">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Application Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {opportunity.applicants}
                      </div>
                      <div className="text-sm text-gray-600">
                        applicants so far
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OpportunityDetail;
