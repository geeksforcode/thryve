from rest_framework import generics, status, permissions, viewsets, filters
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, JSONParser
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from .models import JobSeekerProfile, Experience, Project, Skill
from .serializers import *
from django.db.models import Count
from django.db.models import Q

class IsJobSeeker(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'job_seeker'
    
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class JobSeekerProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsJobSeeker]
    serializer_class = JobSeekerProfileSerializer
    parser_classes = [MultiPartParser, JSONParser]
    
    def get_object(self):
        profile, created = JobSeekerProfile.objects.get_or_create(user=self.request.user)
        return profile
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return JobSeekerProfileUpdateSerializer
        return JobSeekerProfileSerializer

class ExperienceListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsJobSeeker]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateExperienceSerializer
        return ExperienceSerializer
    
    def get_queryset(self):
        profile = get_object_or_404(JobSeekerProfile, user=self.request.user)
        return profile.experiences.all()
    
    def perform_create(self, serializer):
        profile = get_object_or_404(JobSeekerProfile, user=self.request.user)
        serializer.save(profile=profile)

class ExperienceDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsJobSeeker]
    serializer_class = CreateExperienceSerializer
    
    def get_queryset(self):
        profile = get_object_or_404(JobSeekerProfile, user=self.request.user)
        return profile.experiences.all()

class ProjectListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsJobSeeker]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateProjectSerializer
        return CreateProjectSerializer  # Adjust if you have a different serializer for listing
    
    def get_queryset(self):
        profile = get_object_or_404(JobSeekerProfile, user=self.request.user)
        return profile.projects.all()
    
    def perform_create(self, serializer):
        profile = get_object_or_404(JobSeekerProfile, user=self.request.user)
        serializer.save(profile=profile)

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsJobSeeker]
    serializer_class = CreateProjectSerializer
    
    def get_queryset(self):
        profile = get_object_or_404(JobSeekerProfile, user=self.request.user)
        return profile.projects.all()

class AddSkillsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsJobSeeker]
    serializer_class = AddSkillsSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        profile = get_object_or_404(JobSeekerProfile, user=request.user)
        skills = serializer.validated_data['skills']
        
        # Add new skills
        for skill_name in skills:
            Skill.objects.get_or_create(profile=profile, name=skill_name)
        
        return Response({'message': 'Skills added successfully'}, status=status.HTTP_201_CREATED)

class RemoveSkillView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsJobSeeker]
    
    def get_queryset(self):
        profile = get_object_or_404(JobSeekerProfile, user=self.request.user)
        return profile.skills.all()

class UploadResumeView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsJobSeeker]
    serializer_class = UploadResumeSerializer
    parser_classes = [MultiPartParser]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        profile = get_object_or_404(JobSeekerProfile, user=request.user)
        profile.resume = serializer.validated_data['resume']
        profile.save()
        
        return Response({
            'message': 'Resume uploaded successfully',
            'resume_url': profile.resume.url if profile.resume else None
        }, status=status.HTTP_200_OK)

class UploadAvatarView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsJobSeeker]
    serializer_class = UploadAvatarSerializer
    parser_classes = [MultiPartParser]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        profile = get_object_or_404(JobSeekerProfile, user=request.user)
        profile.avatar = serializer.validated_data['avatar']
        profile.save()
        
        # Also update user's picture if needed
        if hasattr(request.user, 'picture'):
            request.user.picture = profile.avatar
            request.user.save()
        
        return Response({
            'message': 'Avatar uploaded successfully',
            'avatar_url': profile.avatar.url if profile.avatar else None
        }, status=status.HTTP_200_OK)
        
class JobSeekerListViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for listing and viewing job seekers
    """
    queryset = JobSeekerProfile.objects.select_related('user').prefetch_related(
        'skills', 'experiences', 'projects__technologies'
    )
    serializer_class = JobSeekerListSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        'user__first_name',
        'user__last_name',
        'title',
        'bio',
        'location',
        'skills__name'
    ]
    ordering_fields = ['rating', 'completed_projects', 'user__date_joined']
    ordering = ['-rating']
    lookup_field = 'user__username'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return JobSeekerDetailSerializer
        return JobSeekerListSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by experience level
        experience_level = self.request.query_params.get('experience_level')
        if experience_level:
            queryset = queryset.filter(experience_level=experience_level)
        
        # Filter by skills
        skills = self.request.query_params.getlist('skills')
        if skills:
            queryset = queryset.filter(skills__name__in=skills).distinct()
        
        # Filter by location
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def filters(self, request):
        """Get available filters for job seekers"""
        filters_data = {
            'experience_levels': dict(JobSeekerProfile.EXPERIENCE_LEVELS),
            'popular_skills': Skill.objects.values('name').annotate(
                count=Count('id')
            ).order_by('-count')[:10],
            'locations': JobSeekerProfile.objects.exclude(
                location=''
            ).values_list('location', flat=True).distinct()[:10],
        }
        return Response(filters_data)
