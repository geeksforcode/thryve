from rest_framework import serializers
from .models import CompanyProfile, Job, JobApplication, SavedJob
from accounts.serializers import UserSerializer
from job_seeker.serializers import SkillSerializer
from job_seeker.models import Skill

class CompanyProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CompanyProfile
        fields = '__all__'
        read_only_fields = ['user', 'rating', 'total_jobs_posted', 'created_at', 'updated_at']

class CompanyProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = [
            'company_name', 'industry', 'logo', 'description', 
            'location', 'website', 'company_size', 'founded_year',
            'phone', 'email', 'linkedin', 'twitter'
        ]

class JobSerializer(serializers.ModelSerializer):
    employer = CompanyProfileSerializer(read_only=True)
    skills_required = SkillSerializer(many=True, read_only=True)
    skills_required_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Skill.objects.all(),
        write_only=True,
        source='skills_required'
    )
    applications_count = serializers.IntegerField(read_only=True)
    views_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['employer', 'applications_count', 'views_count', 'created_at', 'updated_at', 'posted_at']

class JobCreateSerializer(serializers.ModelSerializer):
    skills_required_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Skill.objects.all(),
        write_only=True,
        source='skills_required',
        required=False
    )
    
    class Meta:
        model = Job
        fields = [
            'title', 'description', 'location', 'job_type', 'experience_level',
            'salary_range', 'remote_option', 'requirements', 'responsibilities',
            'qualifications', 'benefits', 'application_deadline', 
            'application_instructions', 'skills_required_ids', 'is_active'
        ]

class JobApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    applicant = UserSerializer(read_only=True)
    
    class Meta:
        model = JobApplication
        fields = '__all__'
        read_only_fields = ['job', 'applicant', 'status', 'notes', 'created_at', 'updated_at']

class JobApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ['cover_letter', 'resume', 'portfolio_url', 'additional_info']

class SavedJobSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    
    class Meta:
        model = SavedJob
        fields = ['id', 'job', 'created_at']
