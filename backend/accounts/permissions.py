from rest_framework import permissions

class IsJobSeeker(permissions.BasePermission):
    """
    Permission check for job seeker users
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'job_seeker')
    
    def has_object_permission(self, request, view, obj):
        # Check if the object belongs to the job seeker
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False

class IsArtist(permissions.BasePermission):
    """
    Permission check for artist users
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'artist')
    
    def has_object_permission(self, request, view, obj):
        # Check if the object belongs to the artist
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'artist'):
            return obj.artist.user == request.user
        return False

class IsInvestor(permissions.BasePermission):
    """
    Permission check for investor users
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'investor')
    
    def has_object_permission(self, request, view, obj):
        # Check if the object belongs to the investor
        if hasattr(obj, 'investor'):
            return obj.investor.user == request.user
        elif hasattr(obj, 'user'):
            return obj.user == request.user
        return False

class IsEmployer(permissions.BasePermission):
    """
    Permission check for employer users
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'employer')
    
    def has_object_permission(self, request, view, obj):
        # Check if the object belongs to the employer
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'employer'):
            return obj.employer.user == request.user
        return False

class IsProfileOwner(permissions.BasePermission):
    """
    Permission check for profile owners
    """
    def has_object_permission(self, request, view, obj):
        # Allow GET, HEAD, OPTIONS for all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Check if the user owns the profile
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False

class IsArtistOrReadOnly(permissions.BasePermission):
    """
    Allow artists to create/edit, but anyone can read
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.role == 'artist')

class IsInvestorOrReadOnly(permissions.BasePermission):
    """
    Allow investors to create/edit, but anyone can read
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.role == 'investor')
