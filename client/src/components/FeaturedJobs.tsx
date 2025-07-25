import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Building } from "lucide-react";
import { Link } from "react-router-dom";

const jobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp Inc.",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $160k",
    postedTime: "2 days ago",
    description: "Join our team to build cutting-edge web applications using React, TypeScript, and modern development practices.",
    skills: ["React", "TypeScript", "Node.js", "GraphQL"],
    applicants: 23,
    companyLogo: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=60&h=60&fit=crop"
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "Design Studio",
    location: "San Francisco, CA",
    type: "Contract",
    salary: "$80 - $120/hr",
    postedTime: "1 day ago",
    description: "Create beautiful and intuitive user experiences for our mobile and web applications.",
    skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research"],
    applicants: 15,
    companyLogo: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=60&h=60&fit=crop"
  },
  {
    id: 3,
    title: "Digital Marketing Manager",
    company: "Growth Labs",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90k - $130k",
    postedTime: "3 days ago",
    description: "Lead our digital marketing efforts across multiple channels and drive customer acquisition.",
    skills: ["SEO", "Google Ads", "Social Media", "Analytics"],
    applicants: 31,
    companyLogo: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=60&h=60&fit=crop"
  },
  {
    id: 4,
    title: "3D Animation Artist",
    company: "Creative Works",
    location: "Los Angeles, CA",
    type: "Freelance",
    salary: "$60 - $90/hr",
    postedTime: "5 days ago",
    description: "Create stunning 3D animations for advertising campaigns and entertainment projects.",
    skills: ["Blender", "Maya", "After Effects", "Cinema 4D"],
    applicants: 8,
    companyLogo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=60&h=60&fit=crop"
  }
];

const FeaturedJobs = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Featured Opportunities
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing job opportunities from top companies and innovative startups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job, index) => (
            <Link key={job.id} to={`/opportunity/${job.id}`}>
              <Card 
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                          {job.title}
                        </CardTitle>
                        <div className="flex items-center text-gray-600">
                          <Building className="w-4 h-4 mr-1" />
                          {job.company}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {job.type}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {job.salary}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {job.postedTime}
                    </div>
                  </div>

                  <CardDescription className="text-gray-600 mb-4">
                    {job.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {job.applicants} applicants
                    </span>
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle apply action
                      }}
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="hover:bg-blue-50">
            View All Jobs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
