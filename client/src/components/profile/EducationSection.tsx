import React from 'react';
import { GraduationCap, Award, Calendar } from 'lucide-react';
import { Profile } from '@/data/profiles';

interface EducationSectionProps {
  profile: Profile;
}

const EducationSection: React.FC<EducationSectionProps> = ({ profile }) => {
  const education = profile.education;

  // Default certifications if none provided
  const defaultCerts = [
    {
      name: `${profile.role} Certification`,
      issuer: 'Professional Association',
      year: '2023',
      icon: '🏆'
    }
  ];

  return (
    <section className="py-20 px-6 bg-accent/20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
          <span>Education & Qualifications</span>
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Education */}
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-8 flex items-center">
              <GraduationCap className="w-8 h-8 mr-3" />
              Education
            </h3>
            
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-card-foreground mb-1">{edu.degree}</h4>
                      <p className="text-primary font-semibold mb-2">{edu.school}</p>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {edu.year}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Certifications */}
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-8 flex items-center">
              <Award className="w-8 h-8 mr-3" />
              Qualifications
            </h3>
            
            <div className="grid gap-4">
              {defaultCerts.map((cert, index) => (
                <div key={index} className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-border">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{cert.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-card-foreground">{cert.name}</h4>
                      <p className="text-primary font-medium">{cert.issuer}</p>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">{cert.year}</span>
                  </div>
                </div>
              ))}
              
              {/* Experience highlights */}
              <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">💼</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-card-foreground">Professional Experience</h4>
                    <p className="text-primary font-medium">{profile.experience}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;