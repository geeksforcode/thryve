import React from 'react';
import { Award, Calendar, TrendingUp, User } from 'lucide-react';
import { Profile } from '@/data/profiles';

interface AboutSectionProps {
  profile: Profile;
}

const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 text-center">About Me</h2>
        
        {/* About Content */}
        <div className="mb-8 sm:mb-12">
          <div className="space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground">
              {profile.bio}
            </p>
            
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground">
              {profile.description}
            </p>
          </div>
        </div>


        <div>
          <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 font-bold text-gray-900 mb-6">Skills & Expertise</h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {profile.skills.map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-accent text-accent-foreground rounded-full text-xs sm:text-sm font-medium hover:bg-accent/80 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;