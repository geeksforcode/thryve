import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[]; // Allow array of roles
  redirectTo?: string;
  requireAuthentication?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  redirectTo = '/auth',
  requireAuthentication = true
}: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If authentication is not required, just render children
  if (!requireAuthentication) {
    return <>{children}</>;
  }

  // If authentication is required but user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role if required
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!allowedRoles.includes(user?.role || '')) {
      // Redirect based on user's role to their appropriate profile
      switch (user?.role) {
        case 'job_seeker':
          return <Navigate to="/profile/job-seeker" replace />;
        case 'artist':
          return <Navigate to="/profile/artist" replace />;
        case 'investor':
          return <Navigate to="/profile/investor" replace />;
        case 'employer':
          return <Navigate to="/profile/employer" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
  }

  return <>{children}</>;
};
