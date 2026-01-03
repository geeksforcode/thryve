from django.urls import path
from .views import (
    JobSeekerProfileView, ExperienceListView, ExperienceDetailView,
    ProjectListView, ProjectDetailView, AddSkillsView, RemoveSkillView,
    UploadResumeView, UploadAvatarView
)

urlpatterns = [
    path('profile/', JobSeekerProfileView.as_view(), name='job-seeker-profile'),
    path('profile/upload-resume/', UploadResumeView.as_view(), name='upload-resume'),
    path('profile/upload-avatar/', UploadAvatarView.as_view(), name='upload-avatar'),
    path('experiences/', ExperienceListView.as_view(), name='experience-list'),
    path('experiences/<int:pk>/', ExperienceDetailView.as_view(), name='experience-detail'),
    path('projects/', ProjectListView.as_view(), name='project-list'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('skills/', AddSkillsView.as_view(), name='add-skills'),
    path('skills/<int:pk>/', RemoveSkillView.as_view(), name='remove-skill'),
]
