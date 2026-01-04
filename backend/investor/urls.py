from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'profiles', views.InvestorProfileViewSet, basename='investor-profile')
router.register(r'focus-areas', views.InvestorFocusAreaViewSet, basename='investor-focus-area')
router.register(r'investments', views.InvestmentViewSet, basename='investment')
router.register(r'pitch-requests', views.PitchRequestViewSet, basename='pitch-request')
router.register(r'interactions', views.InvestorArtistInteractionViewSet, basename='investor-interaction')
router.register(r'saved-artists', views.InvestorSavedArtistViewSet, basename='saved-artist')
router.register(r'milestones', views.InvestmentMilestoneViewSet, basename='milestone')

urlpatterns = [
    path('', include(router.urls)),
    path('discover-artists/', views.InvestorArtistDiscoveryView.as_view(), name='discover-artists'),
]
