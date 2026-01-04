from django.contrib import admin
from .models import CompanyProfile, Job, JobApplication, SavedJob

@admin.register(CompanyProfile)
class CompanyProfileAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'user', 'industry', 'location', 'company_size']
    search_fields = ['company_name', 'user__username', 'user__email']
    list_filter = ['industry', 'company_size']

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'employer', 'job_type', 'location', 'is_active', 'posted_at']
    search_fields = ['title', 'description', 'employer__company_name']
    list_filter = ['job_type', 'experience_level', 'remote_option', 'is_active', 'is_featured']
    filter_horizontal = ['skills_required']

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ['job', 'applicant', 'status', 'created_at']
    search_fields = ['job__title', 'applicant__username', 'applicant__email']
    list_filter = ['status', 'created_at']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(SavedJob)
class SavedJobAdmin(admin.ModelAdmin):
    list_display = ['user', 'job', 'created_at']
    search_fields = ['user__username', 'job__title']
    list_filter = ['created_at']
