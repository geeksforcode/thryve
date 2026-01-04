from rest_framework import generics, status, permissions, viewsets, filters
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from .models import CompanyProfile, Job, JobApplication, SavedJob
from .serializers import *
from accounts.models import CustomUser

class IsEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'employer'

class CompanyProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsEmployer]
    serializer_class = CompanyProfileSerializer
    parser_classes = [MultiPartParser, JSONParser]
    
    def get_object(self):
        profile, created = CompanyProfile.objects.get_or_create(user=self.request.user)
        return profile
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CompanyProfileUpdateSerializer
        return CompanyProfileSerializer

class JobViewSet(viewsets.ModelViewSet):
    """
    ViewSet for job CRUD operations
    """
    permission_classes = [permissions.IsAuthenticated, IsEmployer]
    serializer_class = JobSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'location', 'skills_required__name']
    ordering_fields = ['posted_at', 'applications_count', 'salary_range']
    ordering = ['-posted_at']
    
    def get_queryset(self):
        # Employers can only see their own jobs
        try:
            company_profile = CompanyProfile.objects.get(user=self.request.user)
            return Job.objects.filter(employer=company_profile)
        except CompanyProfile.DoesNotExist:
            return Job.objects.none()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return JobCreateSerializer
        return JobSerializer
    
    def perform_create(self, serializer):
        company_profile = get_object_or_404(CompanyProfile, user=self.request.user)
        serializer.save(employer=company_profile)
        
        # Update company stats
        company_profile.total_jobs_posted += 1
        company_profile.save()
    
    @action(detail=True, methods=['get'])
    def applications(self, request, pk=None):
        """Get all applications for a specific job"""
        job = self.get_object()
        applications = job.applications.all()
        serializer = JobApplicationSerializer(applications, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get job posting statistics"""
        try:
            company_profile = CompanyProfile.objects.get(user=request.user)
            stats = {
                'total_jobs': Job.objects.filter(employer=company_profile).count(),
                'active_jobs': Job.objects.filter(employer=company_profile, is_active=True).count(),
                'total_applications': JobApplication.objects.filter(job__employer=company_profile).count(),
                'applications_by_status': dict(
                    JobApplication.objects.filter(job__employer=company_profile)
                    .values('status')
                    .annotate(count=Count('id'))
                    .values_list('status', 'count')
                ),
                'recent_applications': JobApplication.objects.filter(
                    job__employer=company_profile
                ).order_by('-created_at')[:10]
            }
            return Response(stats)
        except CompanyProfile.DoesNotExist:
            return Response({'error': 'Company profile not found'}, status=status.HTTP_404_NOT_FOUND)

class JobApplicationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for employers to view and manage job applications
    """
    permission_classes = [permissions.IsAuthenticated, IsEmployer]
    serializer_class = JobApplicationSerializer
    
    def get_queryset(self):
        try:
            company_profile = CompanyProfile.objects.get(user=self.request.user)
            return JobApplication.objects.filter(job__employer=company_profile)
        except CompanyProfile.DoesNotExist:
            return JobApplication.objects.none()
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update application status"""
        application = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(JobApplication.APPLICATION_STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.status = new_status
        application.save()
        
        return Response({'status': 'updated', 'new_status': new_status})
    
    @action(detail=True, methods=['patch'])
    def add_note(self, request, pk=None):
        """Add note to application"""
        application = self.get_object()
        note = request.data.get('note', '')
        
        if application.notes:
            application.notes += f"\n\n{note}"
        else:
            application.notes = note
        
        application.save()
        
        return Response({'status': 'note added'})

class PublicJobViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public ViewSet for job listings (accessible to all users)
    """
    queryset = Job.objects.filter(is_active=True).select_related('employer').prefetch_related('skills_required')
    serializer_class = JobSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        'title', 
        'description', 
        'location', 
        'employer__company_name',
        'skills_required__name'
    ]
    ordering_fields = ['posted_at', 'salary_range']
    ordering = ['-posted_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by job type
        job_type = self.request.query_params.get('job_type')
        if job_type:
            queryset = queryset.filter(job_type=job_type)
        
        # Filter by experience level
        experience_level = self.request.query_params.get('experience_level')
        if experience_level:
            queryset = queryset.filter(experience_level=experience_level)
        
        # Filter by location
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        # Filter by remote option
        remote_option = self.request.query_params.get('remote_option')
        if remote_option:
            if remote_option == 'yes':
                queryset = queryset.filter(remote_option='yes')
            elif remote_option == 'no':
                queryset = queryset.filter(remote_option='no')
            elif remote_option == 'hybrid':
                queryset = queryset.filter(remote_option='hybrid')
        
        # Filter by skills
        skills = self.request.query_params.getlist('skills')
        if skills:
            queryset = queryset.filter(skills_required__name__in=skills).distinct()
        
        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        """Increment view count when job is viewed"""
        instance = self.get_object()
        instance.views_count += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class JobApplicationCreateView(generics.CreateAPIView):
    """
    View for job seekers to apply to jobs
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = JobApplicationCreateSerializer
    parser_classes = [MultiPartParser, JSONParser]
    
    def create(self, request, job_id):
        job = get_object_or_404(Job, id=job_id, is_active=True)
        
        # Check if user has already applied
        if JobApplication.objects.filter(job=job, applicant=request.user).exists():
            return Response(
                {'error': 'You have already applied to this job'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create application
        application = JobApplication.objects.create(
            job=job,
            applicant=request.user,
            **serializer.validated_data
        )
        
        # Update job applications count
        job.applications_count += 1
        job.save()
        
        return Response(
            {'message': 'Application submitted successfully', 'application_id': application.id},
            status=status.HTTP_201_CREATED
        )

class SavedJobView(generics.ListCreateAPIView):
    """
    View for job seekers to save/unsave jobs
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SavedJobSerializer
    
    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user)
    
    def create(self, request, job_id):
        job = get_object_or_404(Job, id=job_id, is_active=True)
        
        # Check if already saved
        saved_job, created = SavedJob.objects.get_or_create(
            user=request.user,
            job=job
        )
        
        if created:
            return Response({'message': 'Job saved successfully'}, status=status.HTTP_201_CREATED)
        else:
            saved_job.delete()
            return Response({'message': 'Job removed from saved list'}, status=status.HTTP_200_OK)

class SavedJobDetailView(generics.DestroyAPIView):
    """
    View to remove saved job
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user)
