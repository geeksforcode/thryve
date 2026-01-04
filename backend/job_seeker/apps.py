from django.apps import AppConfig

class JobSeekerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'job_seeker'
    
    def ready(self):
        import job_seeker.signals
