from rest_framework import generics, status, permissions, viewsets, filters
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from .models import *
from .serializers import *

class IsArtist(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'artist'
    
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class ArtistProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsArtist]
    serializer_class = ArtistProfileSerializer
    parser_classes = [MultiPartParser, JSONParser]
    
    def get_object(self):
        profile, created = ArtistProfile.objects.get_or_create(user=self.request.user)
        return profile
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ArtistProfileUpdateSerializer
        return ArtistProfileSerializer

class ArtistSkillViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsArtist]
    serializer_class = ArtistSkillSerializer
    
    def get_queryset(self):
        profile = get_object_or_404(ArtistProfile, user=self.request.user)
        return ArtistSkill.objects.filter(profile=profile)
    
    def perform_create(self, serializer):
        profile = get_object_or_404(ArtistProfile, user=self.request.user)
        serializer.save(profile=profile)

class ArtistExperienceViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsArtist]
    serializer_class = ArtistExperienceSerializer
    
    def get_queryset(self):
        profile = get_object_or_404(ArtistProfile, user=self.request.user)
        return ArtistExperience.objects.filter(profile=profile)
    
    def perform_create(self, serializer):
        profile = get_object_or_404(ArtistProfile, user=self.request.user)
        serializer.save(profile=profile)

class PortfolioViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsArtist]
    serializer_class = PortfolioItemSerializer
    
    def get_queryset(self):
        profile = get_object_or_404(ArtistProfile, user=self.request.user)
        return PortfolioItem.objects.filter(artist=profile)
    
    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return PortfolioItemCreateSerializer
        return PortfolioItemSerializer
    
    def perform_create(self, serializer):
        profile = get_object_or_404(ArtistProfile, user=self.request.user)
        serializer.save(artist=profile)

class ArtistListViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public ViewSet for listing artists
    """
    queryset = ArtistProfile.objects.select_related('user').prefetch_related('skills', 'portfolio_items')
    serializer_class = ArtistListSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        'user__first_name',
        'user__last_name',
        'specialty',
        'bio',
        'location',
        'skills__name'
    ]
    ordering_fields = ['rating', 'total_likes', 'total_views', 'followers_count']
    ordering = ['-rating']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by skills
        skills = self.request.query_params.getlist('skills')
        if skills:
            queryset = queryset.filter(skills__name__in=skills).distinct()
        
        # Filter by location
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        # Filter by availability
        available = self.request.query_params.get('available')
        if available == 'true':
            queryset = queryset.filter(is_available=True)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def filters(self, request):
        """Get available filters for artists"""
        filters_data = {
            'categories': dict(ArtistProfile.ARTIST_CATEGORIES),
            'popular_skills': ArtistSkill.objects.values('name').annotate(
                count=Count('id')
            ).order_by('-count')[:20],
            'locations': ArtistProfile.objects.exclude(
                location=''
            ).values_list('location', flat=True).distinct()[:20],
            'portfolio_categories': dict(PortfolioItem.PORTFOLIO_CATEGORIES),
        }
        return Response(filters_data)

class ArtistDetailViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public ViewSet for detailed artist profile
    """
    queryset = ArtistProfile.objects.select_related('user').prefetch_related(
        'skills', 'experiences', 'portfolio_items__tags'
    )
    serializer_class = ArtistProfileSerializer
    lookup_field = 'user__username'
    
    def retrieve(self, request, *args, **kwargs):
        """Increment view count when artist profile is viewed"""
        instance = self.get_object()
        instance.total_views += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class ArtistLikeView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, artist_id):
        artist = get_object_or_404(ArtistProfile, id=artist_id)
        
        # Check if already liked
        like, created = ArtistLike.objects.get_or_create(
            user=request.user,
            artist=artist
        )
        
        if created:
            artist.total_likes += 1
            artist.save()
            return Response({'message': 'Artist liked'}, status=status.HTTP_201_CREATED)
        else:
            like.delete()
            artist.total_likes -= 1
            artist.save()
            return Response({'message': 'Artist unliked'}, status=status.HTTP_200_OK)

class PortfolioLikeView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, portfolio_id):
        portfolio_item = get_object_or_404(PortfolioItem, id=portfolio_id)
        
        # Check if already liked
        like, created = PortfolioLike.objects.get_or_create(
            user=request.user,
            portfolio_item=portfolio_item
        )
        
        if created:
            portfolio_item.likes_count += 1
            portfolio_item.artist.total_likes += 1
            portfolio_item.save()
            portfolio_item.artist.save()
            return Response({'message': 'Portfolio item liked'}, status=status.HTTP_201_CREATED)
        else:
            like.delete()
            portfolio_item.likes_count -= 1
            portfolio_item.artist.total_likes -= 1
            portfolio_item.save()
            portfolio_item.artist.save()
            return Response({'message': 'Portfolio item unliked'}, status=status.HTTP_200_OK)

class ArtistFollowView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, artist_id):
        artist = get_object_or_404(ArtistProfile, id=artist_id)
        
        # Check if already following
        follow, created = ArtistFollow.objects.get_or_create(
            follower=request.user,
            artist=artist
        )
        
        if created:
            artist.followers_count += 1
            artist.save()
            return Response({'message': 'Artist followed'}, status=status.HTTP_201_CREATED)
        else:
            follow.delete()
            artist.followers_count -= 1
            artist.save()
            return Response({'message': 'Artist unfollowed'}, status=status.HTTP_200_OK)

class CommissionRequestView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CommissionRequestCreateSerializer
    
    def create(self, request, artist_id):
        artist = get_object_or_404(ArtistProfile, id=artist_id)
        
        if not artist.is_available:
            return Response(
                {'error': 'Artist is not currently available for commissions'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        commission = CommissionRequest.objects.create(
            artist=artist,
            client=request.user,
            **serializer.validated_data
        )
        
        return Response(
            {'message': 'Commission request sent successfully', 'commission_id': commission.id},
            status=status.HTTP_201_CREATED
        )

class ArtistStatsView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, IsArtist]
    serializer_class = ArtistProfileSerializer
    
    def get_object(self):
        return get_object_or_404(ArtistProfile, user=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        profile = self.get_object()
        
        stats = {
            'profile_stats': {
                'followers': profile.followers_count,
                'total_likes': profile.total_likes,
                'total_views': profile.total_views,
                'portfolio_items': profile.portfolio_items.count(),
                'commission_requests': profile.commission_requests.count(),
            },
            'portfolio_stats': {
                'total_items': profile.portfolio_items.count(),
                'featured_items': profile.portfolio_items.filter(is_featured=True).count(),
                'total_portfolio_likes': profile.portfolio_items.aggregate(total=Count('likes'))['total'],
                'total_portfolio_views': profile.portfolio_items.aggregate(total=Count('views_count'))['total'],
            },
            'commission_stats': {
                'pending': profile.commission_requests.filter(status='pending').count(),
                'accepted': profile.commission_requests.filter(status='accepted').count(),
                'in_progress': profile.commission_requests.filter(status='in_progress').count(),
                'completed': profile.commission_requests.filter(status='completed').count(),
            }
        }
        
        return Response(stats)
