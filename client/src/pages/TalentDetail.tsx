
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Star, Briefcase, Mail, Phone, Calendar, Globe, Award } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Mock data - in a real app, this would come from an API
const talentDetails = {
  1: {
    id: 1,
    name: "Sarah Chen",
    role: "UI/UX Designer",
    location: "San Francisco, CA",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face",
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "Sketch", "InVision", "Wireframing", "Design Systems"],
    projects: 47,
    hourlyRate: "$85",
    bio: "Passionate UI/UX designer with 6+ years of experience creating intuitive and beautiful digital experiences. I specialize in user-centered design, prototyping, and design systems. I've worked with startups and Fortune 500 companies to deliver impactful design solutions.",
    experience: [
      {
        title: "Senior UX Designer",
        company: "TechFlow Inc.",
        duration: "2022 - Present",
        description: "Led design for mobile and web applications, conducted user research, and established design system standards."
      },
      {
        title: "UX Designer",
        company: "Design Studio Pro",
        duration: "2020 - 2022",
        description: "Designed user interfaces for e-commerce platforms and collaborated with development teams on implementation."
      },
      {
        title: "Junior UI Designer",
        company: "Creative Agency",
        duration: "2018 - 2020",
        description: "Created visual designs for websites and mobile apps, focusing on user interface design and branding."
      }
    ],
    portfolio: [
      {
        title: "E-commerce Mobile App",
        description: "Complete redesign of mobile shopping experience",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop"
      },
      {
        title: "SaaS Dashboard",
        description: "Analytics dashboard for business intelligence platform",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop"
      },
      {
        title: "Healthcare App",
        description: "Patient management system interface design",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop"
      }
    ],
    education: [
      {
        degree: "Master of Fine Arts in Digital Design",
        school: "California College of the Arts",
        year: "2018"
      },
      {
        degree: "Bachelor of Arts in Graphic Design",
        school: "UC Berkeley",
        year: "2016"
      }
    ],
    certifications: [
      "Google UX Design Certificate",
      "Adobe Certified Expert",
      "Figma Advanced Certification"
    ],
    languages: ["English (Native)", "Mandarin (Fluent)", "Spanish (Conversational)"],
    availability: "Available for new projects",
    responseTime: "Within 2 hours"
  }
};

const TalentDetail = () => {
  const { id } = useParams();
  const talent = talentDetails[id as keyof typeof talentDetails];

  if (!talent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="py-20 px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Talent Not Found</h1>
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
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <img
                    src={talent.image}
                    alt={talent.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {talent.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-3">{talent.role}</p>
                  <div className="flex items-center justify-center text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {talent.location}
                  </div>
                  <div className="flex items-center justify-center mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                    <span className="text-lg font-semibold text-gray-700">
                      {talent.rating}
                    </span>
                    <span className="text-gray-500 ml-2">
                      ({talent.projects} projects)
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-6">
                    {talent.hourlyRate}/hr
                  </div>
                  <div className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Schedule Call
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {talent.availability}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response time:</span>
                    <span className="font-medium">{talent.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total projects:</span>
                    <span className="font-medium">{talent.projects}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {talent.languages.map((language, index) => (
                      <div key={index} className="text-sm text-gray-700">
                        {language}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {talent.bio}
                  </p>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {talent.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {talent.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-blue-200 pl-4">
                        <div className="flex items-center mb-2">
                          <Briefcase className="w-4 h-4 text-blue-600 mr-2" />
                          <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                        </div>
                        <div className="text-blue-600 font-medium mb-1">{exp.company}</div>
                        <div className="text-sm text-gray-500 mb-2">{exp.duration}</div>
                        <p className="text-gray-700 text-sm">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {talent.portfolio.map((project, index) => (
                      <div key={index} className="group cursor-pointer">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-48 object-cover rounded-lg mb-3 group-hover:opacity-90 transition-opacity"
                        />
                        <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                        <p className="text-sm text-gray-600">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {talent.education.map((edu, index) => (
                        <div key={index}>
                          <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                          <p className="text-sm text-gray-600">{edu.school}</p>
                          <p className="text-sm text-gray-500">{edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {talent.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                          <span className="text-sm text-gray-700">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TalentDetail;
