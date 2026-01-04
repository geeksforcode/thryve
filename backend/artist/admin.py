from django.contrib import admin
from .models import *

@admin.register(ArtistProfile)
class ArtistProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'specialty', 'category', 'location', 'is_available', 'rating']
    search_fields = ['user__username', 'user__email', 'specialty', 'bio']
    list_filter = ['category', 'is_available']

@admin.register(ArtistSkill)
class ArtistSkillAdmin(admin.ModelAdmin):
    list_display = ['profile', 'name', 'level']
    search_fields = ['name', 'profile__user__username']

@admin.register(ArtistExperience)
class ArtistExperienceAdmin(admin.ModelAdmin):
    list_display = ['profile', 'role', 'company', 'start_date', 'current']
    search_fields = ['role', 'company', 'profile__user__username']

@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ['artist', 'title', 'category', 'is_featured', 'is_visible', 'likes_count']
    search_fields = ['title', 'artist__user__username', 'description']
    list_filter = ['category', 'is_featured', 'is_visible']

@admin.register(CommissionRequest)
class CommissionRequestAdmin(admin.ModelAdmin):
    list_display = ['artist', 'client', 'title', 'status', 'budget', 'created_at']
    search_fields = ['title', 'artist__user__username', 'client__username']
    list_filter = ['status', 'category']
