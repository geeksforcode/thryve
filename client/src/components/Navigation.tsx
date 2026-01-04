import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, Briefcase, Users, Palette, TrendingUp } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'job_seeker': return 'Job Seeker'
      case 'artist': return 'Artist'
      case 'investor': return 'Investor'
      case 'employer': return 'Employer'
      default: return 'Member'
    }
  }

  const getProfileLink = () => {
    if (!user) return '/auth'
    switch(user.role) {
      case 'job_seeker': return '/profile/job-seeker'
      case 'artist': return '/profile/artist'
      case 'investor': return '/profile/investor'
      case 'employer': return '/profile/employer'
      default: return '/'
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 no-underline">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="font-heading font-bold text-2xl text-foreground">Thryve</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Main navigation - available to everyone */}
            <Link 
              to="/listings/jobs" 
              className="flex items-center text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Jobs
            </Link>
            
            <Link 
              to="/listings/job-seekers" 
              className="flex items-center text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Users className="h-4 w-4 mr-2" />
              Talent
            </Link>
            
            <Link 
              to="/listings/artists" 
              className="flex items-center text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Palette className="h-4 w-4 mr-2" />
              Artists
            </Link>
            
            <Link 
              to="/listings/investors" 
              className="flex items-center text-muted-foreground hover:text-foreground transition-smooth"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Investors
            </Link>

            {/* Role-specific quick actions for authenticated users 
            {isAuthenticated && user?.role === 'employer' && (
              <Button
                variant="default"
                size="sm"
                className="bg-gradient-primary hover:opacity-90"
                asChild
              >
                <Link to="/listings/job-seekers">
                  <Users className="h-4 w-4 mr-2" />
                  Hire Talent
                </Link>
              </Button>
            )}

            {isAuthenticated && user?.role === 'job_seeker' && (
              <Button
                variant="default"
                size="sm"
                className="bg-gradient-primary hover:opacity-90"
                asChild
              >
                <Link to="/profile/job-seeker">
                  <Briefcase className="h-4 w-4 mr-2" />
                  My Profile
                </Link>
              </Button>
            )} */}

            {/* Upgrade link - Available to everyone */}
            <Link 
              to="/upgrade" 
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-primary hover:from-purple-500/20 hover:to-pink-500/20 transition-smooth"
            >
              Upgrade
            </Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* User profile and role badge */}
                <div className="flex items-center space-x-3">
                  <div className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {getRoleLabel(user?.role || '')}
                  </div>
                  <Link to={getProfileLink()}>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center space-x-2 text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button className="bg-gradient-primary hover:opacity-90 transition-smooth shadow-card" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col space-y-4">
              {/* Main mobile navigation */}
              <Link 
                to="/listings/jobs" 
                className="flex items-center text-muted-foreground hover:text-foreground transition-smooth py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Briefcase className="h-4 w-4 mr-3" />
                Jobs
              </Link>
              
              <Link 
                to="/listings/job-seekers" 
                className="flex items-center text-muted-foreground hover:text-foreground transition-smooth py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="h-4 w-4 mr-3" />
                Talent
              </Link>
              
              <Link 
                to="/listings/artists" 
                className="flex items-center text-muted-foreground hover:text-foreground transition-smooth py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Palette className="h-4 w-4 mr-3" />
                Artists
              </Link>
              
              <Link 
                to="/listings/investors" 
                className="flex items-center text-muted-foreground hover:text-foreground transition-smooth py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <TrendingUp className="h-4 w-4 mr-3" />
                Investors
              </Link>

              {/* Role-specific quick actions for mobile */}
              {isAuthenticated && user?.role === 'employer' && (
                <Button
                  variant="default"
                  className="bg-gradient-primary hover:opacity-90"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/listings/job-seekers">
                    <Users className="h-4 w-4 mr-2" />
                    Hire Talent
                  </Link>
                </Button>
              )}

              {isAuthenticated && user?.role === 'job_seeker' && (
                <Button
                  variant="default"
                  className="bg-gradient-primary hover:opacity-90"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/profile/job-seeker">
                    <Briefcase className="h-4 w-4 mr-2" />
                    My Profile
                  </Link>
                </Button>
              )}

              {/* Upgrade link */}
              <Link 
                to="/upgrade" 
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-primary hover:from-purple-500/20 hover:to-pink-500/20 transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Upgrade
              </Link>

              {/* User section */}
              {isAuthenticated ? (
                <>
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                        {getRoleLabel(user?.role || '')}
                      </div>
                    </div>
                    
                    <Link 
                      to={getProfileLink()} 
                      className="flex items-center text-muted-foreground hover:text-foreground transition-smooth py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      My Profile
                    </Link>
                    
                    <Button 
                      variant="ghost" 
                      className="justify-start text-destructive hover:text-destructive w-full"
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                  <Button variant="ghost" className="justify-start" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button className="bg-gradient-primary hover:opacity-90 transition-smooth shadow-card" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
