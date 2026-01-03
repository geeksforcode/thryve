from rest_framework import serializers
from .models import JobSeekerProfile, Experience, Project, ProjectTechnology, Skill
from accounts.serializers import UserSerializer

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']

class ProjectTechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTechnology
        fields = ['id', 'name']

class ProjectSerializer(serializers.ModelSerializer):
    technologies = ProjectTechnologySerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'link', 'technologies', 'created_at']

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'title', 'company', 'period', 'description', 'start_date', 'end_date', 'is_current']

class JobSeekerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)
    projects = ProjectSerializer(many=True, read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    
    class Meta:
        model = JobSeekerProfile
        fields = [
            'id', 'user', 'bio', 'title', 'experience_level', 'location',
            'phone', 'resume', 'avatar', 'rating', 'completed_projects',
            'review_count', 'experiences', 'projects', 'skills',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['rating', 'completed_projects', 'review_count', 'user']

class JobSeekerProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeekerProfile
        fields = ['bio', 'title', 'experience_level', 'location', 'phone']

class CreateExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['title', 'company', 'period', 'description', 'start_date', 'end_date', 'is_current']

class CreateProjectSerializer(serializers.ModelSerializer):
    technologies = serializers.ListField(child=serializers.CharField(), write_only=True)
    
    class Meta:
        model = Project
        fields = ['name', 'description', 'link', 'technologies']
    
    def create(self, validated_data):
        technologies = validated_data.pop('technologies', [])
        project = Project.objects.create(**validated_data)
        
        for tech_name in technologies:
            ProjectTechnology.objects.create(project=project, name=tech_name)
        
        return project

class AddSkillsSerializer(serializers.Serializer):
    skills = serializers.ListField(child=serializers.CharField())

class UploadResumeSerializer(serializers.Serializer):
    resume = serializers.FileField()

class UploadAvatarSerializer(serializers.Serializer):
    avatar = serializers.ImageField()
