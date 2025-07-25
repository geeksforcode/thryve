
import React from 'react';
import { useParams } from 'react-router-dom';
import { getProfileById, profiles } from '@/data/profiles';
import ProfileHeader from '@/components/profile/ProfileHeader';
import AboutSection from '@/components/profile/AboutSection';
import PortfolioSection from '@/components/profile/PortfolioSection';
import ExperienceSection from '@/components/profile/ExperienceSection';
import EducationSection from '@/components/profile/EducationSection';
import SocialLinksSection from '@/components/profile/SocialLinksSection';
import ReviewsSection from '@/components/profile/ReviewsSection';

const Index = () => {
  const { id } = useParams();
  const profile = id ? getProfileById(id) : profiles[0]; // Default to first profile if no ID

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground">The requested profile could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ProfileHeader profile={profile} />
      <AboutSection profile={profile} />
      <ReviewsSection profile={profile} />
      <PortfolioSection profile={profile} />
      <ExperienceSection profile={profile} />
      <EducationSection profile={profile} />
      <SocialLinksSection profile={profile} />
    </div>
  );
};

export default Index;
