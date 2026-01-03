from django.db import models
from accounts.models import CustomUser
from job_seeker.models import Skill

class CompanyProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='company_profile')
    company_name = models.CharField(max_length=255)
    industry = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)
    description = models.TextField()
    location = models.CharField(max_length=255)
    website = models.URLField(max_length=200, blank=True)
    company_size = models.CharField(max_length=50)  # e.g., "1-10", "11-50", "51-200", etc.
    founded_year = models.PositiveIntegerField(null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    
    # Social media links
    linkedin = models.URLField(max_length=200, blank=True)
    twitter = models.URLField(max_length=200, blank=True)
    
    # Company stats
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    total_jobs_posted = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.company_name

class Job(models.Model):
    JOB_TYPE_CHOICES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('freelance', 'Freelance'),
        ('internship', 'Internship'),
        ('temporary', 'Temporary'),
    ]
    
    EXPERIENCE_LEVEL_CHOICES = [
        ('entry', 'Entry Level'),
        ('mid', 'Mid Level'),
        ('senior', 'Senior'),
        ('lead', 'Lead'),
        ('executive', 'Executive'),
    ]
    
    WORK_REMOTE_CHOICES = [
        ('no', 'On-site Only'),
        ('yes', 'Remote Only'),
        ('hybrid', 'Hybrid'),
    ]
    
    employer = models.ForeignKey(CompanyProfile, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES)
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVEL_CHOICES)
    salary_range = models.CharField(max_length=100, blank=True)  # e.g., "$80,000 - $120,000"
    remote_option = models.CharField(max_length=20, choices=WORK_REMOTE_CHOICES, default='no')
    
    # Requirements
    requirements = models.TextField(blank=True)
    responsibilities = models.TextField(blank=True)
    qualifications = models.TextField(blank=True)
    
    # Benefits
    benefits = models.TextField(blank=True)
    
    # Application details
    application_deadline = models.DateField(null=True, blank=True)
    application_instructions = models.TextField(blank=True)
    
    # Skills
    skills_required = models.ManyToManyField(Skill, related_name='jobs', blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    # Stats
    views_count = models.PositiveIntegerField(default=0)
    applications_count = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    posted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-posted_at', '-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.employer.company_name}"

class JobApplication(models.Model):
    APPLICATION_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('shortlisted', 'Shortlisted'),
        ('interview', 'Interview Scheduled'),
        ('rejected', 'Rejected'),
        ('accepted', 'Accepted'),
        ('withdrawn', 'Withdrawn'),
    ]
    
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='job_applications')
    
    # Application details
    cover_letter = models.TextField()
    resume = models.FileField(upload_to='job_applications/resumes/', null=True, blank=True)
    portfolio_url = models.URLField(max_length=200, blank=True)
    additional_info = models.TextField(blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=APPLICATION_STATUS_CHOICES, default='pending')
    
    # Admin notes
    notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['job', 'applicant']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.applicant.get_full_name()} - {self.job.title}"

class SavedJob(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_by')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'job']
    
    def __str__(self):
        return f"{self.user.username} saved {self.job.title}"
