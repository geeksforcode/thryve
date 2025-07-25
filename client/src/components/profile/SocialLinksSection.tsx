import React from 'react';
import { Github, Linkedin, Instagram, Globe, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Profile } from '@/data/profiles';

interface SocialLinksSectionProps {
  profile: Profile;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ profile }) => {
  const socialLinks = [
    {
      name: 'Email',
      url: `mailto:${profile.email}`,
      icon: Mail,
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Direct contact for opportunities'
    },
    ...(profile.socialLinks.linkedin ? [{
      name: 'LinkedIn',
      url: profile.socialLinks.linkedin,
      icon: Linkedin,
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Professional network & career updates'
    }] : []),
    ...(profile.socialLinks.github ? [{
      name: 'GitHub',
      url: profile.socialLinks.github,
      icon: Github,
      color: 'bg-gray-800 hover:bg-gray-900',
      description: 'Code repositories & projects'
    }] : []),
    ...(profile.socialLinks.website ? [{
      name: 'Website',
      url: profile.socialLinks.website,
      icon: Globe,
      color: 'bg-purple-600 hover:bg-purple-700',
      description: 'Personal website & portfolio'
    }] : []),
    ...(profile.socialLinks.instagram ? [{
      name: 'Instagram',
      url: profile.socialLinks.instagram,
      icon: Instagram,
      color: 'bg-pink-600 hover:bg-pink-700',
      description: 'Behind-the-scenes & inspiration'
    }] : [])
  ];

  return (
    <section className="py-20 px-6 bg-accent/20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
          <span>Connect With {profile.name}</span>
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-12">
          Let's connect and explore opportunities together!
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="bg-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-border">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${link.color} rounded-xl flex items-center justify-center transition-colors duration-300 shadow-lg`}>
                    <link.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-card-foreground group-hover:text-primary transition-colors">
                      {link.name}
                    </h3>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {link.description}
                </p>
              </div>
            </a>
          ))}
        </div>
        
        {/* Quick Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-card rounded-2xl p-8 border border-border">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Ready to Work Together?</h3>
            <p className="text-muted-foreground mb-6">
              I'm always open to discussing new opportunities and interesting projects.
            </p>
            <Link to="/contact">
              <span className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-primary-foreground px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg ">
                Get In Touch
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialLinksSection;