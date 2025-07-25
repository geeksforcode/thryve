import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Profile } from '@/data/profiles';

interface ExperienceSectionProps {
  profile: Profile;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ profile }) => {
  const experiences = profile.workHistory;

  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
          <span>Work Experience</span>
        </h2>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-secondary hidden md:block"></div>
          
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index} className="relative md:ml-16">
                {/* Timeline Dot */}
                <div className="absolute -left-20 top-6 w-4 h-4 gradient-bg rounded-full border-4 border-background shadow-lg hidden md:block"></div>
                
                <div className="bg-card rounded-2xl p-8 hover:shadow-lg transition-shadow border border-border">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold gradient-text mb-2">{exp.role}</h3>
                      <p className="text-xl text-card-foreground font-semibold mb-2">{exp.company}</p>
                    </div>
                    <div className="flex flex-col lg:items-end text-muted-foreground mb-4 lg:mb-0">
                      <div className="flex items-center mb-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-medium">{exp.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;