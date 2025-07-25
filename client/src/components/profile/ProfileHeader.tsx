import React from 'react';
import { MapPin, Star, Download, MessageCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Profile } from '@/data/profiles';

interface ProfileHeaderProps {
  profile: Profile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const downloadCV = () => {
    // Create a simple CV content
    const cvContent = `
${profile.name} - ${profile.role}
Location: ${profile.location}
Experience: ${profile.experience}
Email: ${profile.email}
Phone: ${profile.phone}

Skills: ${profile.skills.join(', ')}

About: ${profile.bio}

Work History:
${profile.workHistory.map(job => `
• ${job.role} at ${job.company} (${job.duration})
  ${job.description}
`).join('')}

Education:
${profile.education.map(edu => `
• ${edu.degree} - ${edu.school} (${edu.year})
`).join('')}
    `;
    
    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name.replace(' ', '_')}_CV.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      {/* Background with gradient overlay */}
      <div className="h-80 bg-gradient-to-br from-background via-accent to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
        
        {/* Profile content */}
        <div className="relative z-20 max-w-6xl mx-auto px-6 pt-8">
          {/* Back to profiles button */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Link to="/dashboard">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Dashboard
              </Button>
            </Link>
            <Link to="/profiles">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 lg:gap-8">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-card shadow-2xl">
                <img 
                  src={profile.image} 
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Status indicator */}
              {profile.isActive && (
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-card shadow-lg">
                  <div className="w-2 h-2 bg-card rounded-full mx-auto mt-1 animate-pulse"></div>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">{profile.name}</h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-4">{profile.role}</p>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 mb-4 lg:mb-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{profile.rating}</span>
                  <span>({profile.reviews} reviews)</span>
                </div>
                <div className="text-2xl font-bold text-primary">{profile.hourlyRate}</div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                    Contact Me
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto px-4 lg:px-6 py-3 hover:scale-105 transition-transform"
                  onClick={downloadCV}
                >
                  <Download className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                  Download CV
                </Button>
                <Link to="/profiles" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto px-4 lg:px-6 py-3">
                    Browse All Profiles
                  </Button>
                </Link>
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 lg:px-6 py-3">
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;