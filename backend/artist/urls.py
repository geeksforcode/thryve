from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

# Create routers
router = DefaultRouter()
router.register(r'skills', ArtistSkillViewSet, basename='artist-skills')
router.register(r'experiences', ArtistExperienceViewSet, basename='artist-experiences')
router.register(r'portfolio', PortfolioViewSet, basename='artist-portfolio')

# Public artist routes
public_router = DefaultRouter()
public_router.register(r'listings', ArtistListViewSet, basename='artist-listings')
public_router.register(r'profiles', ArtistDetailViewSet, basename='artist-detail')

urlpatterns = [
    # Artist profile management
    path('profile/', ArtistProfileView.as_view(), name='artist-profile'),
    path('stats/', ArtistStatsView.as_view(), name='artist-stats'),
    
    # Artist management
    path('', include(router.urls)),
    
    # Public artist endpoints
    path('', include(public_router.urls)),
    
    # Artist interactions
    path('listings/<int:artist_id>/like/', ArtistLikeView.as_view(), name='artist-like'),
    path('listings/<int:artist_id>/follow/', ArtistFollowView.as_view(), name='artist-follow'),
    path('portfolio/<int:portfolio_id>/like/', PortfolioLikeView.as_view(), name='portfolio-like'),
    path('listings/<int:artist_id>/commission/', CommissionRequestView.as_view(), name='artist-commission'),
]
