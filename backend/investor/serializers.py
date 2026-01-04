from rest_framework import serializers
from .models import (
    InvestorProfile, InvestorFocusArea, Investment,
    PitchRequest, InvestorArtistInteraction,
    InvestorSavedArtist, InvestmentMilestone
)
from accounts.serializers import UserSerializer
from artist.serializers import ArtistProfileSerializer

class InvestorFocusAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestorFocusArea
        fields = ['id', 'name', 'description', 'priority']

class InvestorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    focus_areas = InvestorFocusAreaSerializer(many=True, read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = InvestorProfile
        fields = [
            'id', 'user', 'bio', 'investor_type', 'company', 'position',
            'location', 'website', 'linkedin', 'twitter',
            'investment_range_min', 'investment_range_max',
            'focus_industries', 'investment_stages',
            'total_investments', 'total_portfolio_value',
            'successful_exits', 'avg_ticket_size',
            'is_accepting_pitches', 'focus_areas', 'full_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'total_investments', 'total_portfolio_value',
            'successful_exits', 'avg_ticket_size'
        ]
    
    def get_full_name(self, obj):
        return obj.user.get_full_name()
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Ensure JSON fields are properly formatted
        representation['focus_industries'] = instance.focus_industries or []
        representation['investment_stages'] = instance.investment_stages or []
        return representation

class InvestmentSerializer(serializers.ModelSerializer):
    investor_name = serializers.CharField(source='investor.company', read_only=True)
    artist_name = serializers.CharField(source='artist.user.get_full_name', read_only=True)
    artist_username = serializers.CharField(source='artist.user.username', read_only=True)
    
    class Meta:
        model = Investment
        fields = [
            'id', 'investor', 'artist', 'investor_name', 'artist_name', 'artist_username',
            'amount', 'investment_type', 'equity_percentage', 'project_name',
            'project_description', 'valuation', 'investment_date',
            'expected_roi', 'exit_strategy', 'is_active', 'is_successful',
            'exit_date', 'exit_value', 'created_at', 'updated_at'
        ]
        read_only_fields = ['is_successful', 'exit_date', 'exit_value']

class PitchRequestSerializer(serializers.ModelSerializer):
    investor_name = serializers.CharField(source='investor.company', read_only=True)
    artist_name = serializers.CharField(source='artist.user.get_full_name', read_only=True)
    artist_username = serializers.CharField(source='artist.user.username', read_only=True)
    
    class Meta:
        model = PitchRequest
        fields = [
            'id', 'investor', 'artist', 'investor_name', 'artist_name', 'artist_username',
            'title', 'executive_summary', 'problem_statement', 'solution',
            'market_size', 'business_model', 'team_description',
            'funding_amount', 'funding_use', 'valuation', 'equity_offered',
            'pitch_deck', 'financial_projections', 'additional_docs',
            'status', 'investor_notes', 'meeting_scheduled',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['status', 'investor_notes', 'meeting_scheduled']

class InvestorArtistInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestorArtistInteraction
        fields = [
            'id', 'investor', 'artist', 'interaction_type',
            'notes', 'rating', 'created_at'
        ]

class InvestorSavedArtistSerializer(serializers.ModelSerializer):
    artist_data = serializers.SerializerMethodField()
    
    class Meta:
        model = InvestorSavedArtist
        fields = [
            'id', 'investor', 'artist', 'artist_data',
            'notes', 'priority', 'created_at', 'updated_at'
        ]
        read_only_fields = ['investor']
    
    def get_artist_data(self, obj):
        from artist.serializers import ArtistProfileSerializer
        return ArtistProfileSerializer(obj.artist).data

class InvestmentMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestmentMilestone
        fields = [
            'id', 'investment', 'title', 'description',
            'due_date', 'completed_date', 'is_completed',
            'created_at', 'updated_at'
        ]

class PitchRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PitchRequest
        fields = [
            'id', 'investor', 'artist', 'title', 'executive_summary',
            'problem_statement', 'solution', 'market_size',
            'business_model', 'team_description', 'funding_amount',
            'funding_use', 'valuation', 'equity_offered',
            'pitch_deck', 'financial_projections', 'additional_docs'
        ]
        read_only_fields = ['investor', 'artist']
    
    def validate(self, data):
        # Ensure the artist exists
        if 'artist' not in data:
            raise serializers.ValidationError({"artist": "Artist is required"})
        
        # Ensure the investor exists
        if 'investor' not in data:
            raise serializers.ValidationError({"investor": "Investor is required"})
        
        return data

class InvestorStatsSerializer(serializers.Serializer):
    total_investments = serializers.IntegerField()
    total_portfolio_value = serializers.DecimalField(max_digits=15, decimal_places=2)
    successful_exits = serializers.IntegerField()
    avg_ticket_size = serializers.DecimalField(max_digits=12, decimal_places=2)
    active_investments = serializers.IntegerField()
    artists_following = serializers.IntegerField()
    pending_pitches = serializers.IntegerField()
    
    def create(self, validated_data):
        pass
    
    def update(self, instance, validated_data):
        pass
