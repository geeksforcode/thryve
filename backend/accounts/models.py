from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('job_seeker', 'Job Seeker'),
        ('artist', 'Artist'),
        ('investor', 'Investor'),
        ('employer', 'Employer'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='job_seeker')
    bio = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    
    def __str__(self):
        return self.email

