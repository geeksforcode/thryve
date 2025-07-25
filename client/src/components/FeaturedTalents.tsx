import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const talents = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "UI/UX Designer",
    location: "San Francisco, CA",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face",
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    projects: 47,
    hourlyRate: "$85"
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Full-Stack Developer",
    location: "New York, NY",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face",
    skills: ["React", "Node.js", "Python", "AWS"],
    projects: 32,
    hourlyRate: "$95"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Digital Artist",
    location: "Los Angeles, CA",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face",
    skills: ["Illustration", "3D Modeling", "Animation", "Concept Art"],
    projects: 28,
    hourlyRate: "$70"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Data Scientist",
    location: "Seattle, WA",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop&crop=face",
    skills: ["Python", "Machine Learning", "SQL", "Tableau"],
    projects: 19,
    hourlyRate: "$105"
  }
];

const FeaturedTalents = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Featured Talents
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover exceptional professionals ready to bring your projects to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {talents.map((talent, index) => (
            <Link key={talent.id} to={`/talent/${talent.id}`}>
              <Card 
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <img
                      src={talent.image}
                      alt={talent.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover group-hover:scale-105 transition-transform"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {talent.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{talent.role}</p>
                    <div className="flex items-center justify-center text-sm text-gray-500 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {talent.location}
                    </div>
                    <div className="flex items-center justify-center mb-4">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium text-gray-700">
                        {talent.rating}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({talent.projects} projects)
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {talent.skills.slice(0, 3).map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {talent.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{talent.skills.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="text-center">
                    <span className="text-lg font-bold text-green-600">
                      {talent.hourlyRate}/hr
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTalents;
