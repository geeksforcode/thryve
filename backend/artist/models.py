from django.db import models
from accounts.models import CustomUser
from django.core.validators import FileExtensionValidator

class ArtistProfile(models.Model):
    ARTIST_CATEGORIES = [
        ('digital_art', 'Digital Art'),
        ('photography', 'Photography'),
        ('graphic_design', 'Graphic Design'),
        ('illustration', 'Illustration'),
        ('painting', 'Painting'),
        ('sculpture', 'Sculpture'),
        ('animation', 'Animation'),
        ('video', 'Video Production'),
        ('music', 'Music'),
        ('writing', 'Writing'),
        ('other', 'Other'),
    ]
    
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='artist_profile')
    bio = models.TextField()
    category = models.CharField(max_length=50, choices=ARTIST_CATEGORIES)
    specialty = models.CharField(max_length=200)
    location = models.CharField(max_length=255)
    website = models.URLField(max_length=200, blank=True)
    instagram = models.CharField(max_length=100, blank=True)
    behance = models.CharField(max_length=100, blank=True)
    dribbble = models.CharField(max_length=100, blank=True)
    youtube = models.URLField(max_length=200, blank=True)
    
    # Stats
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    followers_count = models.PositiveIntegerField(default=0)
    total_likes = models.PositiveIntegerField(default=0)
    total_views = models.PositiveIntegerField(default=0)
    
    # Availability
    is_available = models.BooleanField(default=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    project_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.specialty}"

class ArtistSkill(models.Model):
    profile = models.ForeignKey(ArtistProfile, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    level = models.CharField(max_length=50, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ])
    
    def __str__(self):
        return f"{self.name} - {self.level}"

class ArtistExperience(models.Model):
    profile = models.ForeignKey(ArtistProfile, on_delete=models.CASCADE, related_name='experiences')
    role = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    current = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.role} at {self.company}"

class PortfolioItem(models.Model):
    PORTFOLIO_CATEGORIES = [
        ('character_design', 'Character Design'),
        ('concept_art', 'Concept Art'),
        ('digital_painting', 'Digital Painting'),
        ('illustration', 'Illustration'),
        ('graphic_design', 'Graphic Design'),
        ('photography', 'Photography'),
        ('animation', 'Animation'),
        ('ui_ux', 'UI/UX Design'),
        ('logo_branding', 'Logo & Branding'),
        ('print_design', 'Print Design'),
        ('3d_modeling', '3D Modeling'),
        ('vfx', 'VFX'),
        ('motion_graphics', 'Motion Graphics'),
        ('other', 'Other'),
    ]
    
    artist = models.ForeignKey(ArtistProfile, on_delete=models.CASCADE, related_name='portfolio_items')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=PORTFOLIO_CATEGORIES)
    
    # Media
    image = models.ImageField(upload_to='portfolio/images/', null=True, blank=True)
    video_url = models.URLField(max_length=200, blank=True)
    video_file = models.FileField(
        upload_to='portfolio/videos/',
        validators=[FileExtensionValidator(allowed_extensions=['mp4', 'mov', 'avi'])],
        null=True,
        blank=True
    )
    
    # Metadata
    year_created = models.PositiveIntegerField(null=True, blank=True)
    client = models.CharField(max_length=200, blank=True)
    project_url = models.URLField(max_length=200, blank=True)
    
    # Stats
    likes_count = models.PositiveIntegerField(default=0)
    views_count = models.PositiveIntegerField(default=0)
    
    # Status
    is_featured = models.BooleanField(default=False)
    is_visible = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_featured', '-created_at']
    
    def __str__(self):
        return f"{self.title} by {self.artist.user.get_full_name()}"

class PortfolioTag(models.Model):
    item = models.ForeignKey(PortfolioItem, on_delete=models.CASCADE, related_name='tags')
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

class ArtistLike(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    artist = models.ForeignKey(ArtistProfile, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'artist']
    
    def __str__(self):
        return f"{self.user.username} likes {self.artist.user.get_full_name()}"

class PortfolioLike(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    portfolio_item = models.ForeignKey(PortfolioItem, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'portfolio_item']
    
    def __str__(self):
        return f"{self.user.username} likes {self.portfolio_item.title}"

class ArtistFollow(models.Model):
    follower = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='following_artists')
    artist = models.ForeignKey(ArtistProfile, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['follower', 'artist']
    
    def __str__(self):
        return f"{self.follower.username} follows {self.artist.user.get_full_name()}"

class CommissionRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    artist = models.ForeignKey(ArtistProfile, on_delete=models.CASCADE, related_name='commission_requests')
    client = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='commission_requests')
    
    # Project details
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=PortfolioItem.PORTFOLIO_CATEGORIES)
    
    # Requirements
    deadline = models.DateField(null=True, blank=True)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    reference_images = models.TextField(blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    artist_notes = models.TextField(blank=True)
    client_notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Commission: {self.title} - {self.artist.user.get_full_name()}"
