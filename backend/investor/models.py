from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from accounts.models import CustomUser
from artist.models import ArtistProfile

class InvestorProfile(models.Model):
    INVESTOR_TYPES = [
        ('angel', 'Angel Investor'),
        ('vc', 'Venture Capital'),
        ('corporate', 'Corporate Investor'),
        ('family_office', 'Family Office'),
        ('syndicate', 'Investment Syndicate'),
        ('crowdfunding', 'Crowdfunding Platform'),
        ('private_equity', 'Private Equity'),
    ]
    
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='investor_profile')
    bio = models.TextField()
    investor_type = models.CharField(max_length=50, choices=INVESTOR_TYPES)
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    
    # Contact Information
    website = models.URLField(max_length=200, blank=True)
    linkedin = models.URLField(max_length=200, blank=True)
    twitter = models.CharField(max_length=100, blank=True)
    
    # Investment Preferences
    investment_range_min = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    investment_range_max = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Focus Areas
    focus_industries = models.JSONField(default=list, blank=True)
    investment_stages = models.JSONField(default=list, blank=True)
    
    # Stats
    total_investments = models.PositiveIntegerField(default=0)
    total_portfolio_value = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    successful_exits = models.PositiveIntegerField(default=0)
    avg_ticket_size = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Availability
    is_accepting_pitches = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.company}"

class InvestorFocusArea(models.Model):
    investor = models.ForeignKey(InvestorProfile, on_delete=models.CASCADE, related_name='focus_areas')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    priority = models.PositiveIntegerField(default=1)  # 1 = highest priority
    
    class Meta:
        ordering = ['priority']
    
    def __str__(self):
        return f"{self.name} - {self.investor.company}"

class Investment(models.Model):
    INVESTMENT_TYPES = [
        ('equity', 'Equity'),
        ('debt', 'Debt'),
        ('convertible_note', 'Convertible Note'),
        ('grant', 'Grant'),
        ('royalty', 'Royalty Agreement'),
        ('other', 'Other'),
    ]
    
    investor = models.ForeignKey(InvestorProfile, on_delete=models.CASCADE, related_name='investments')
    artist = models.ForeignKey(ArtistProfile, on_delete=models.CASCADE, related_name='investments_received')
    
    # Investment Details
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    investment_type = models.CharField(max_length=50, choices=INVESTMENT_TYPES)
    equity_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # Project Details
    project_name = models.CharField(max_length=200)
    project_description = models.TextField()
    
    # Terms
    valuation = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    investment_date = models.DateField()
    expected_roi = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # Percentage
    exit_strategy = models.TextField(blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_successful = models.BooleanField(default=False)
    exit_date = models.DateField(null=True, blank=True)
    exit_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-investment_date']
    
    def __str__(self):
        return f"{self.investor.company} invested ${self.amount} in {self.artist.user.get_full_name()}"

class PitchRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('under_review', 'Under Review'),
        ('accepted', 'Accepted for Meeting'),
        ('declined', 'Declined'),
        ('funded', 'Funded'),
        ('archived', 'Archived'),
    ]
    
    investor = models.ForeignKey(InvestorProfile, on_delete=models.CASCADE, related_name='pitch_requests')
    artist = models.ForeignKey(ArtistProfile, on_delete=models.CASCADE, related_name='pitches_made')
    
    # Pitch Details
    title = models.CharField(max_length=200)
    executive_summary = models.TextField()
    problem_statement = models.TextField()
    solution = models.TextField()
    market_size = models.TextField(blank=True)
    business_model = models.TextField(blank=True)
    team_description = models.TextField(blank=True)
    
    # Funding Request
    funding_amount = models.DecimalField(max_digits=12, decimal_places=2)
    funding_use = models.TextField()
    valuation = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    equity_offered = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # Attachments
    pitch_deck = models.FileField(upload_to='pitch_decks/', null=True, blank=True)
    financial_projections = models.FileField(upload_to='financial_projects/', null=True, blank=True)
    additional_docs = models.FileField(upload_to='pitch_docs/', null=True, blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    investor_notes = models.TextField(blank=True)
    meeting_scheduled = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Pitch: {self.title} to {self.investor.company}"

class InvestorArtistInteraction(models.Model):
    INTERACTION_TYPES = [
        ('viewed', 'Viewed Profile'),
        ('saved', 'Saved for Later'),
        ('contacted', 'Contacted'),
        ('pitched', 'Pitched Idea'),
        ('invested', 'Invested In'),
        ('followed', 'Followed'),
    ]
    
    investor = models.ForeignKey(InvestorProfile, on_delete=models.CASCADE, related_name='artist_interactions')
    artist = models.ForeignKey(ArtistProfile, on_delete=models.CASCADE, related_name='investor_interactions')
    interaction_type = models.CharField(max_length=50, choices=INTERACTION_TYPES)
    
    # Interaction Details
    notes = models.TextField(blank=True)
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        null=True,
        blank=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['investor', 'artist', 'interaction_type']
    
    def __str__(self):
        return f"{self.investor.user.username} {self.interaction_type} {self.artist.user.username}"

class InvestorSavedArtist(models.Model):
    investor = models.ForeignKey(InvestorProfile, on_delete=models.CASCADE, related_name='saved_artists')
    artist = models.ForeignKey(ArtistProfile, on_delete=models.CASCADE, related_name='saved_by_investors')
    notes = models.TextField(blank=True)
    priority = models.PositiveIntegerField(default=1)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['investor', 'artist']
        ordering = ['priority', '-created_at']
    
    def __str__(self):
        return f"{self.investor.company} saved {self.artist.user.get_full_name()}"

class InvestmentMilestone(models.Model):
    investment = models.ForeignKey(Investment, on_delete=models.CASCADE, related_name='milestones')
    title = models.CharField(max_length=200)
    description = models.TextField()
    due_date = models.DateField(null=True, blank=True)
    completed_date = models.DateField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['due_date', '-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.investment.project_name}"
