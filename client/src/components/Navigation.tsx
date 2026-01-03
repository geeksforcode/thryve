import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
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
            {isAuthenticated ? (
              <>
                {/* Role-specific navigation for authenticated users */}
                {user?.role === 'job_seeker' && (
                  <>
                    <Link to="/listings/jobs" className="text-muted-foreground hover:text-foreground transition-smooth">
                      Find Jobs
                    </Link>
                    <Link to="/listings/artists" className="text-muted-foreground hover:text-foreground transition-smooth">
                      Hire Artists
                    </Link>
                    <Link to="/listings/investors" className="text-muted-foreground hover:text-foreground transition-smooth">
                      Find Investors
                    </Link>
                  </>
                )}
                
                {user?.role === 'artist' && (
                  <>
                    <Link to="/listings/artists" className="text-muted-foreground hover:text-foreground transition-smooth">
                      Artists Gallery
                    </Link>
                    <Link to="/listings/jobs" className="text-muted-foreground hover:text-foreground transition-smooth">
                      Creative Jobs
                    </Link>
                  </>
                )}
                
                {user?.role === 'investor' && (
                  <>
                    <Link to="/listings/investors" className="text-muted-foreground hover:text-foreground transition-smooth">
                      Investors Network
                    </Link>
                    <Link to="/listings/job-seekers" className="text-muted-foreground hover:text-foreground transition-smooth">
                      Find Talent
                    </Link>
                  </>
                )}
                
                {user?.role === 'employer' && (
                  <>
                    <Link to="/listings/job-seekers" className="text-muted-foreground hover:text-foreground transition-smooth">
                      Find Talent
                    </Link>
                    <Link to="/listings/artists" className="text-muted-foreground hover:text-foreground transition-smooth">
                      Hire Artists
                    </Link>
                  </>
                )}

                {/* Common navigation for all authenticated users */}
                <Link to="/upgrade" className="text-muted-foreground hover:text-foreground transition-smooth">
                  Upgrade
                </Link>
              </>
            ) : (
              <>
                {/* Public navigation for non-authenticated users */}
                <Link to="/listings/jobs" className="text-muted-foreground hover:text-foreground transition-smooth">
                  Jobs
                </Link>
                <Link to="/listings/job-seekers" className="text-muted-foreground hover:text-foreground transition-smooth">
                  Talent
                </Link>
                <Link to="/listings/artists" className="text-muted-foreground hover:text-foreground transition-smooth">
                  Artists
                </Link>
                <Link to="/listings/investors" className="text-muted-foreground hover:text-foreground transition-smooth">
                  Investors
                </Link>
                <Link to="/upgrade" className="text-muted-foreground hover:text-foreground transition-smooth">
                  Upgrade
                </Link>
              </>
            )}
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
              {isAuthenticated ? (
                <>
                  {/* Mobile role-specific navigation for authenticated users */}
                  {user?.role === 'job_seeker' && (
                    <>
                      <Link to="/listings/jobs" className="text-muted-foreground hover:text-foreground transition-smooth">
                        Find Jobs
                      </Link>
                      <Link to="/listings/artists" className="text-muted-foreground hover:text-foreground transition-smooth">
                        Hire Artists
                      </Link>
                      <Link to="/listings/investors" className="text-muted-foreground hover:text-foreground transition-smooth">
                        Find Investors
                      </Link>
                    </>
                  )}
                  
                  {user?.role === 'artist' && (
                    <>
                      <Link to="/listings/artists" className="text-muted-foreground hover:text-foreground transition-smooth">
                        Artists Gallery
                      </Link>
                      <Link to="/listings/jobs" className="text-muted-foreground hover:text-foreground transition-smooth">
                        Creative Jobs
                      </Link>
                    </>
                  )}
                  
                  {user?.role === 'investor' && (
                    <>
                      <Link to="/listings/investors" className="text-muted-foreground hover:text-foreground transition-smooth">
                        Investors Network
                      </Link>
                      <Link to="/listings/job-seekers" className="text-muted-foreground hover:text-foreground transition-smooth">
                        Find Talent
                      </Link>
                    </>
                  )}
                  
                  {user?.role === 'employer' && (
                    <>
                      <Link to="/listings/job-seekers" className="text-muted-foreground hover:text-foreground transition-smooth">
                        Find Talent
                      </Link>
                      <Link to="/listings/artists" className="text-muted-foreground hover:text-foreground transition-smooth">
                        Hire Artists
                      </Link>
                    </>
                  )}

                  {/* Common mobile navigation for all authenticated users */}
                  <Link to="/upgrade" className="text-muted-foreground hover:text-foreground transition-smooth">
                    Upgrade
                  </Link>
                  <Link to={getProfileLink()} className="text-muted-foreground hover:text-foreground transition-smooth">
                    My Profile
                  </Link>
                  
                  <div className="flex flex-col space-y-2 pt-4">
                    <div className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium inline-block w-fit">
                      {getRoleLabel(user?.role || '')}
                    </div>
                    <Button 
                      variant="ghost" 
                      className="justify-start text-destructive hover:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Mobile public navigation */}
                  <Link to="/listings/jobs" className="text-muted-foreground hover:text-foreground transition-smooth">
                    Jobs
                  </Link>
                  <Link to="/listings/job-seekers" className="text-muted-foreground hover:text-foreground transition-smooth">
                    Talent
                  </Link>
                  <Link to="/listings/artists" className="text-muted-foreground hover:text-foreground transition-smooth">
                    Artists
                  </Link>
                  <Link to="/listings/investors" className="text-muted-foreground hover:text-foreground transition-smooth">
                    Investors
                  </Link>
                  <Link to="/upgrade" className="text-muted-foreground hover:text-foreground transition-smooth">
                    Upgrade
                  </Link>
                  
                  <div className="flex flex-col space-y-2 pt-4">
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link to="/auth">Sign In</Link>
                    </Button>
                    <Button className="bg-gradient-primary hover:opacity-90 transition-smooth shadow-card" asChild>
                      <Link to="/auth">Get Started</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
