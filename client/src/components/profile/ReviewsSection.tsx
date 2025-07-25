import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Profile } from '@/data/profiles';

interface ReviewsSectionProps {
  profile: Profile;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ profile }) => {
  // Default reviews based on profile type
  const defaultReviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Project Manager',
      rating: 5,
      comment: `Working with ${profile.name} was an excellent experience. Their expertise in ${profile.role.toLowerCase()} really showed through in the quality of work delivered. Professional, reliable, and skilled.`,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      project: `${profile.skills[0]} Project`
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      role: 'Client',
      rating: 5,
      comment: `${profile.name} exceeded our expectations with their ${profile.role.toLowerCase()} services. The attention to detail and professionalism was outstanding. Highly recommend!`,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      project: 'Service Project'
    }
  ];

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              i < rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          <span>Client Reviews</span>
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground text-center mb-8 sm:mb-12">
          What people say about working with {profile.name}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
          {defaultReviews.map((review) => (
            <div key={review.id} className="bg-card rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow relative border border-border">
              <Quote className="w-6 h-6 lg:w-8 lg:h-8 text-primary/20 absolute top-3 right-4 lg:top-4 lg:right-6" />
              
              <div className="flex items-center mb-4 lg:mb-6">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full object-cover mr-3 lg:mr-4 border-2 border-primary/20"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-card-foreground text-sm sm:text-base">{review.name}</h3>
                  <p className="text-primary font-medium text-xs sm:text-sm mb-1">{review.role}</p>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed mb-3 lg:mb-4 italic text-sm sm:text-base">
                "{review.comment}"
              </p>
              
              <div className="pt-3 lg:pt-4 border-t border-border">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Project: <span className="font-medium text-card-foreground">{review.project}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Overall Rating Summary */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-lg inline-block border border-border">
            <div className="flex items-center justify-center mb-4">
              <StarRating rating={Math.floor(profile.rating)} />
              <span className="ml-3 text-xl sm:text-2xl font-bold gradient-text">{profile.rating}</span>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Average rating from <span className="font-semibold">{profile.reviews} reviews</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;