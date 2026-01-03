from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

# Create routers
router = DefaultRouter()
router.register(r'jobs', JobViewSet, basename='employer-jobs')
router.register(r'applications', JobApplicationViewSet, basename='employer-applications')

# Public job routes (in separate router or as direct paths)
public_router = DefaultRouter()
public_router.register(r'jobs', PublicJobViewSet, basename='public-jobs')

urlpatterns = [
    # Employer profile
    path('profile/', CompanyProfileView.as_view(), name='employer-profile'),
    
    # Employer job management
    path('', include(router.urls)),
    
    # Public job listings (for job seekers)
    path('listings/', include(public_router.urls)),
    
    # Job applications (for job seekers)
    path('listings/jobs/<int:job_id>/apply/', JobApplicationCreateView.as_view(), name='apply-to-job'),
    path('listings/jobs/<int:job_id>/save/', SavedJobView.as_view(), name='save-job'),
    path('saved-jobs/<int:pk>/', SavedJobDetailView.as_view(), name='remove-saved-job'),
    
    # Additional endpoints
    path('stats/', JobViewSet.as_view({'get': 'stats'}), name='employer-stats'),
]

# Include public router URLs
urlpatterns += public_router.urls
