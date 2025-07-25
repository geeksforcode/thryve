import React from 'react';
import { ArrowLeft, Eye, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { profiles } from '@/data/profiles';

const ProfileList = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 mb-6">
            <Link to="/dashboard">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Dashboard
              </Button>
            </Link>
            <Link to="/">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl sm:text-4xl font-bold text-gray-900 mb-6">Talent Profiles</h1>
          <p className="text-base lg:text-lg text-muted-foreground">
            Discover exceptional talent across various specializations - from tech professionals to skilled tradespeople and service providers
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
              {/* Profile Header */}
              <div className="relative p-6 bg-gradient-to-br from-accent to-secondary">
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-card shadow-lg">
                      <img 
                        src={profile.image} 
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {profile.isActive && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-card">
                        <div className="w-2 h-2 bg-card rounded-full mx-auto mt-1 animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-card-foreground mb-1">{profile.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{profile.role}</p>
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{profile.location}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{profile.description}</p>
              </div>

              {/* Profile Details */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.slice(0, 4).map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length > 4 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                        +{profile.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/profile/${profile.id}`} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon">
                    <Star className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-accent to-secondary rounded-2xl p-8">
            <h3 className="text-2xl font-bold gradient-text mb-4">Looking to Join Our Network?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Are you a talented developer, designer, or tech professional? Join our curated network of exceptional talent.
            </p>
            <Link to="/profile/joinus">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Apply to Join
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileList;