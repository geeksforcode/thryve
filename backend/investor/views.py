from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count, Sum, Avg
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    InvestorProfile, InvestorFocusArea, Investment,
    PitchRequest, InvestorArtistInteraction,
    InvestorSavedArtist, InvestmentMilestone
)
from .serializers import (
    InvestorProfileSerializer, InvestorFocusAreaSerializer,
    InvestmentSerializer, PitchRequestSerializer,
    InvestorArtistInteractionSerializer, InvestorSavedArtistSerializer,
    InvestmentMilestoneSerializer, PitchRequestCreateSerializer,
    InvestorStatsSerializer
)
from artist.models import ArtistProfile
from accounts.permissions import IsInvestor

User = get_user_model()

class InvestorProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Investor Profiles
    """
    serializer_class = InvestorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__first_name', 'user__last_name', 'company', 'position', 'location']
    filterset_fields = ['investor_type', 'location', 'is_accepting_pitches']
    ordering_fields = ['total_portfolio_value', 'total_investments', 'created_at']
    
    def get_queryset(self):
        return InvestorProfile.objects.select_related('user').prefetch_related('focus_areas')
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsInvestor()]
        return [permissions.IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return InvestorProfileSerializer
        return super().get_serializer_class()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Get current user's investor profile
        """
        try:
            profile = request.user.investor_profile
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except InvestorProfile.DoesNotExist:
            return Response(
                {"detail": "Investor profile not found. Please create one."},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Get investor stats for current user
        """
        try:
            profile = request.user.investor_profile
            
            # Calculate stats
            stats = {
                'total_investments': profile.total_investments,
                'total_portfolio_value': profile.total_portfolio_value,
                'successful_exits': profile.successful_exits,
                'avg_ticket_size': profile.avg_ticket_size,
                'active_investments': Investment.objects.filter(
                    investor=profile,
                    is_active=True
                ).count(),
                'artists_following': InvestorSavedArtist.objects.filter(
                    investor=profile
                ).count(),
                'pending_pitches': PitchRequest.objects.filter(
                    investor=profile,
                    status='pending'
                ).count()
            }
            
            serializer = InvestorStatsSerializer(stats)
            return Response(serializer.data)
        except InvestorProfile.DoesNotExist:
            return Response(
                {"detail": "Investor profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

class InvestorFocusAreaViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Investor Focus Areas
    """
    serializer_class = InvestorFocusAreaSerializer
    permission_classes = [permissions.IsAuthenticated, IsInvestor]
    
    def get_queryset(self):
        return InvestorFocusArea.objects.filter(investor=self.request.user.investor_profile)
    
    def perform_create(self, serializer):
        serializer.save(investor=self.request.user.investor_profile)

class InvestmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Investments
    """
    serializer_class = InvestmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsInvestor]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['investment_type', 'is_active', 'is_successful']
    search_fields = ['project_name', 'artist__user__first_name', 'artist__user__last_name']
    ordering_fields = ['investment_date', 'amount', 'created_at']
    
    def get_queryset(self):
        return Investment.objects.filter(investor=self.request.user.investor_profile)
    
    def perform_create(self, serializer):
        serializer.save(investor=self.request.user.investor_profile)

class PitchRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Pitch Requests
    """
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'investor', 'artist']
    search_fields = ['title', 'executive_summary']
    ordering_fields = ['created_at', 'updated_at']
    
    def get_queryset(self):
        user = self.request.user
        
        # Investors can see pitches sent to them
        # Artists can see pitches they've made
        if hasattr(user, 'investor_profile'):
            return PitchRequest.objects.filter(investor=user.investor_profile)
        elif hasattr(user, 'artist_profile'):
            return PitchRequest.objects.filter(artist=user.artist_profile)
        
        return PitchRequest.objects.none()
    
    def get_serializer_class(self):
        if self.action in ['create']:
            return PitchRequestCreateSerializer
        return PitchRequestSerializer
    
    def perform_create(self, serializer):
        if hasattr(self.request.user, 'artist_profile'):
            serializer.save(artist=self.request.user.artist_profile)
        else:
            raise serializers.ValidationError(
                {"detail": "Only artists can create pitch requests."}
            )
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """
        Update pitch request status (only for investors)
        """
        pitch = self.get_object()
        
        # Check if user is the investor
        if not hasattr(request.user, 'investor_profile') or pitch.investor != request.user.investor_profile:
            return Response(
                {"detail": "Only the investor can update pitch status."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        status_value = request.data.get('status')
        notes = request.data.get('investor_notes', '')
        
        if status_value not in dict(PitchRequest.STATUS_CHOICES).keys():
            return Response(
                {"detail": "Invalid status value."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        pitch.status = status_value
        pitch.investor_notes = notes
        pitch.save()
        
        serializer = self.get_serializer(pitch)
        return Response(serializer.data)

class InvestorArtistInteractionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for tracking investor-artist interactions
    """
    serializer_class = InvestorArtistInteractionSerializer
    permission_classes = [permissions.IsAuthenticated, IsInvestor]
    
    def get_queryset(self):
        return InvestorArtistInteraction.objects.filter(investor=self.request.user.investor_profile)
    
    def perform_create(self, serializer):
        serializer.save(investor=self.request.user.investor_profile)

class InvestorSavedArtistViewSet(viewsets.ModelViewSet):
    """
    ViewSet for investor saved artists (watchlist/favorites)
    """
    serializer_class = InvestorSavedArtistSerializer
    permission_classes = [permissions.IsAuthenticated, IsInvestor]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['priority', 'created_at']
    
    def get_queryset(self):
        return InvestorSavedArtist.objects.filter(investor=self.request.user.investor_profile)
    
    def perform_create(self, serializer):
        serializer.save(investor=self.request.user.investor_profile)

class InvestorArtistDiscoveryView(APIView):
    """
    View for investors to discover artists based on their preferences
    """
    permission_classes = [permissions.IsAuthenticated, IsInvestor]
    
    def get(self, request):
        try:
            investor_profile = request.user.investor_profile
            
            # Start with all artists
            queryset = ArtistProfile.objects.select_related('user').prefetch_related('skills')
            
            # Apply filters based on investor preferences
            if investor_profile.focus_industries:
                # Filter by artist category if it matches investor's focus industries
                queryset = queryset.filter(category__in=investor_profile.focus_industries)
            
            if investor_profile.investment_range_min:
                # Filter by hourly/project rate within investment range
                queryset = queryset.filter(
                    Q(hourly_rate__gte=investor_profile.investment_range_min) |
                    Q(project_rate__gte=investor_profile.investment_range_min)
                )
            
            # Order by popularity/relevance
            queryset = queryset.annotate(
                total_engagement=(
                    models.F('followers_count') +
                    models.F('total_likes') +
                    models.F('total_views')
                )
            ).order_by('-total_engagement', '-rating')
            
            # Paginate results
            page = self.paginate_queryset(queryset)
            if page is not None:
                from artist.serializers import ArtistProfileSerializer
                serializer = ArtistProfileSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            from artist.serializers import ArtistProfileSerializer
            serializer = ArtistProfileSerializer(queryset, many=True)
            return Response(serializer.data)
            
        except InvestorProfile.DoesNotExist:
            return Response(
                {"detail": "Investor profile not found. Please create one."},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def paginate_queryset(self, queryset):
        """
        Override to use Django REST Framework's pagination
        """
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, self.request, view=self)
        return page

class InvestmentMilestoneViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Investment Milestones
    """
    serializer_class = InvestmentMilestoneSerializer
    permission_classes = [permissions.IsAuthenticated, IsInvestor]
    
    def get_queryset(self):
        return InvestmentMilestone.objects.filter(
            investment__investor=self.request.user.investor_profile
        )
