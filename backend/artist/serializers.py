from rest_framework import serializers
from .models import *
from accounts.serializers import UserSerializer

class ArtistSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtistSkill
        fields = ['id', 'name', 'level']

class ArtistExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtistExperience
        fields = ['id', 'role', 'company', 'location', 'start_date', 'end_date', 'current', 'description']

class PortfolioTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioTag
        fields = ['id', 'name']

class PortfolioItemSerializer(serializers.ModelSerializer):
    tags = PortfolioTagSerializer(many=True, read_only=True)
    
    class Meta:
        model = PortfolioItem
        fields = [
            'id', 'title', 'description', 'category', 'image', 'video_url',
            'year_created', 'client', 'project_url', 'likes_count', 'views_count',
            'is_featured', 'is_visible', 'tags', 'created_at'
        ]

class ArtistProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    skills = ArtistSkillSerializer(many=True, read_only=True)
    experiences = ArtistExperienceSerializer(many=True, read_only=True)
    portfolio_items = PortfolioItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = ArtistProfile
        fields = '__all__'
        read_only_fields = ['user', 'rating', 'followers_count', 'total_likes', 'total_views', 'created_at', 'updated_at']

class ArtistProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtistProfile
        fields = [
            'bio', 'category', 'specialty', 'location', 'website',
            'instagram', 'behance', 'dribbble', 'youtube',
            'is_available', 'hourly_rate', 'project_rate'
        ]

class ArtistListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    skills = ArtistSkillSerializer(many=True, read_only=True)
    featured_portfolio = serializers.SerializerMethodField()
    
    class Meta:
        model = ArtistProfile
        fields = [
            'id', 'user', 'bio', 'category', 'specialty', 'location',
            'rating', 'followers_count', 'total_likes', 'total_views',
            'is_available', 'skills', 'featured_portfolio'
        ]
    
    def get_featured_portfolio(self, obj):
        featured_items = obj.portfolio_items.filter(is_featured=True, is_visible=True)[:3]
        return PortfolioItemSerializer(featured_items, many=True).data

class PortfolioItemCreateSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        write_only=True
    )
    
    class Meta:
        model = PortfolioItem
        fields = [
            'title', 'description', 'category', 'image', 'video_url', 'video_file',
            'year_created', 'client', 'project_url', 'is_featured', 'is_visible', 'tags'
        ]
    
    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        portfolio_item = PortfolioItem.objects.create(**validated_data)
        
        # Create tags
        for tag_name in tags_data:
            PortfolioTag.objects.create(item=portfolio_item, name=tag_name)
        
        return portfolio_item

class CommissionRequestSerializer(serializers.ModelSerializer):
    artist = ArtistProfileSerializer(read_only=True)
    client = UserSerializer(read_only=True)
    
    class Meta:
        model = CommissionRequest
        fields = '__all__'
        read_only_fields = ['artist', 'client', 'status', 'artist_notes', 'created_at', 'updated_at']

class CommissionRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionRequest
        fields = ['title', 'description', 'category', 'deadline', 'budget', 'reference_images']
