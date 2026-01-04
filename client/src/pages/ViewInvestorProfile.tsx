import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { 
  MapPin, Mail, DollarSign, TrendingUp, 
  Building, Target, Globe, Linkedin, 
  Twitter, Loader2, ExternalLink, Briefcase,
  Calendar, Award, Users, MessageSquare,
  AlertCircle, CheckCircle
} from "lucide-react"
import Navigation from "@/components/Navigation"
import ContactModal from "@/components/modals/ContactModal"
import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { 
  getInvestorDetail, 
  trackInteraction,
  saveArtist
} from "@/services/apiClient"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

interface InvestorProfileType {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture?: string;
  };
  bio: string;
  investor_type: string;
  company: string;
  position: string;
  location: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  investment_range_min: string;
  investment_range_max: string;
  focus_industries: string[];
  investment_stages: string[];
  total_investments: number;
  total_portfolio_value: string;
  successful_exits: number;
  avg_ticket_size: string;
  is_accepting_pitches: boolean;
  created_at: string;
  updated_at: string;
}

interface Investment {
  id: number;
  artist: {
    user: {
      first_name: string;
      last_name: string;
      username: string;
    };
  };
  project_name: string;
  project_description: string;
  amount: string;
  investment_type: string;
  investment_date: string;
  is_active: boolean;
  is_successful: boolean;
}

interface InvestorStats {
  total_investments: number;
  total_portfolio_value: string;
  successful_exits: number;
  avg_ticket_size: string;
  active_investments: number;
  artists_following: number;
  pending_pitches: number;
}

const ViewInvestorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [savingArtist, setSavingArtist] = useState(false);
  const [profile, setProfile] = useState<InvestorProfileType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    const loadInvestorProfile = async () => {
      if (!id) {
        navigate('/listings/investors');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const profileData = await getInvestorDetail(parseInt(id));
        setProfile(profileData);
        
        // Track view interaction if authenticated and artist
        if (isAuthenticated && authUser?.role === 'artist') {
          try {
            await trackInteraction(profileData.id, 'viewed');
          } catch (err) {
            console.error('Failed to track interaction:', err);
          }
        }
        
      } catch (err: any) {
        console.error('Failed to load investor profile:', err);
        setError(err.message || 'Failed to load investor profile');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadInvestorProfile();
  }, [id, isAuthenticated, navigate, authUser]);

  const handleSaveArtist = async () => {
    if (!profile || !isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    try {
      setSavingArtist(true);
      await saveArtist(profile.id);
      setIsSaved(true);
      
      toast({
        title: "Success",
        description: "Investor saved to your list",
        variant: "default",
      });
      
    } catch (err: any) {
      console.error('Failed to save artist:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to save investor',
        variant: "destructive",
      });
    } finally {
      setSavingArtist(false);
    }
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return value;
    
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const formatInvestmentRange = (min: string, max: string) => {
    const minNum = parseFloat(min);
    const maxNum = parseFloat(max);
    
    if (isNaN(minNum) || isNaN(maxNum)) return "N/A";
    
    if (minNum === 0 && maxNum === 0) return "Flexible";
    
    const formatMin = minNum >= 1000000 ? `${(minNum / 1000000).toFixed(1)}M` :
                     minNum >= 1000 ? `${(minNum / 1000).toFixed(1)}K` : minNum.toFixed(0);
    const formatMax = maxNum >= 1000000 ? `${(maxNum / 1000000).toFixed(1)}M` :
                     maxNum >= 1000 ? `${(maxNum / 1000).toFixed(1)}K` : maxNum.toFixed(0);
    
    return `$${formatMin} - $${formatMax}`;
  };

  const getInvestorTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'angel': 'Angel Investor',
      'vc': 'Venture Capital',
      'corporate': 'Corporate Investor',
      'family_office': 'Family Office',
      'syndicate': 'Investment Syndicate',
      'crowdfunding': 'Crowdfunding Platform',
      'private_equity': 'Private Equity',
    };
    return types[type] || type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short',
      day: 'numeric'
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex flex-col justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">
            Loading investor profile...
          </p>
        </div>
      </div>
    );
  }

  // Show error for profile not found
  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Investor not found
          </h1>
          <p className="text-muted-foreground mt-2">
            The investor profile could not be found.
          </p>
          {error && (
            <Alert variant="destructive" className="mt-4 max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="mt-4 space-x-4">
            <Button asChild>
              <Link to="/listings/investors">Back to Investors</Link>
            </Button>
            {isAuthenticated && authUser?.role === 'investor' && (
              <Button asChild variant="outline">
                <Link to="/profile/investor">View Your Profile</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Back Button */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <Link to="/listings/investors">
                ← Back to Investors
              </Link>
            </Button>
          </div>
          
          {/* Investor Header */}
          <Card className="shadow-card mb-8">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <Avatar className="w-24 h-24 lg:w-32 lg:h-32 mx-auto sm:mx-0">
                    <AvatarImage 
                      src={profile.user.profile_picture} 
                      alt={`${profile.user.first_name} ${profile.user.last_name}`} 
                    />
                    <AvatarFallback className="text-xl lg:text-2xl">
                      {getInitials(profile.user.first_name, profile.user.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center sm:text-left space-y-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
                        {profile.user.first_name} {profile.user.last_name}
                      </h1>
                      <p className="text-lg lg:text-xl text-primary font-medium mb-1">
                        {profile.position}
                      </p>
                      <p className="text-base lg:text-lg text-muted-foreground font-medium mb-3">
                        {profile.company}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-muted-foreground text-sm lg:text-base">
                        <div className="flex items-center justify-center sm:justify-start">
                          <MapPin className="h-4 w-4 mr-2" />
                          {profile.location}
                        </div>
                        <div className="flex items-center justify-center sm:justify-start">
                          <DollarSign className="h-4 w-4 mr-2" />
                          {formatInvestmentRange(
                            profile.investment_range_min, 
                            profile.investment_range_max
                          )}
                        </div>
                        <div className="flex items-center justify-center sm:justify-start">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          <Badge variant="secondary">
                            {getInvestorTypeLabel(profile.investor_type)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 lg:gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-foreground">
                          {formatCurrency(profile.total_portfolio_value)}
                        </div>
                        <div className="text-muted-foreground">Portfolio Value</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{profile.total_investments}</div>
                        <div className="text-muted-foreground">Investments</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{profile.successful_exits}</div>
                        <div className="text-muted-foreground">Exits</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">
                          {formatCurrency(profile.avg_ticket_size)}
                        </div>
                        <div className="text-muted-foreground">Avg Ticket</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  {isAuthenticated && authUser?.role === 'artist' && (
                    <>
                      {profile.is_accepting_pitches ? (
                        <ContactModal 
                          recipientName={`${profile.user.first_name} ${profile.user.last_name}`}
                          recipientType="investor"
                          triggerText="Send Pitch"
                          triggerVariant="default"
                          investorId={profile.id}
                        />
                      ) : (
                        <Button variant="outline" disabled className="cursor-not-allowed">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Not Accepting Pitches
                        </Button>
                      )}
                      
                      <Button 
                        variant={isSaved ? "default" : "outline"}
                        onClick={handleSaveArtist}
                        disabled={savingArtist || isSaved}
                      >
                        {savingArtist ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : isSaved ? (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        ) : null}
                        {savingArtist ? 'Saving...' : isSaved ? 'Saved' : 'Save Investor'}
                      </Button>
                    </>
                  )}
                  
                  {!isAuthenticated && (
                    <div className="flex flex-col space-y-2">
                      <Button asChild>
                        <Link to="/auth?role=artist">
                          Sign Up to Connect
                        </Link>
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        Create an artist account to pitch ideas
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-xl font-heading font-semibold text-foreground">About</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {profile.bio || "No bio available."}
                  </p>
                </CardContent>
              </Card>

              {/* Investment Focus */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-xl font-heading font-semibold text-foreground flex items-center">
                    <Target className="h-5 w-5 mr-2 text-primary" />
                    Investment Focus
                  </h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Focus Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.focus_industries && profile.focus_industries.length > 0 ? (
                        profile.focus_industries.map((area) => (
                          <Badge key={area} variant="secondary" className="text-sm py-1.5 px-3">
                            {area}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">Not specified</p>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Investment Stage Preference</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.investment_stages && profile.investment_stages.length > 0 ? (
                        profile.investment_stages.map((stage) => (
                          <Badge key={stage} variant="outline" className="text-sm py-1.5 px-3">
                            {stage}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">Not specified</p>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Investment Range</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <span className="font-medium text-lg text-primary">
                          {formatInvestmentRange(
                            profile.investment_range_min, 
                            profile.investment_range_max
                          )}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Average ticket size: {formatCurrency(profile.avg_ticket_size)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Success Metrics */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-xl font-heading font-semibold text-foreground flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary" />
                    Track Record
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {profile.successful_exits}
                      </div>
                      <div className="text-sm text-muted-foreground">Successful Exits</div>
                    </div>
                    
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {profile.total_investments}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Investments</div>
                    </div>
                    
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {profile.total_investments > 0 
                          ? Math.round((profile.successful_exits / profile.total_investments) * 100) 
                          : 0}%
                      </div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                    
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(profile.total_portfolio_value)}
                      </div>
                      <div className="text-sm text-muted-foreground">Portfolio Value</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links & Contact */}
              {(profile.website || profile.linkedin || profile.twitter) && (
                <Card className="shadow-card">
                  <CardHeader>
                    <h2 className="text-xl font-heading font-semibold text-foreground">Connect</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-foreground mb-3">Professional Links</h3>
                        <div className="flex flex-wrap gap-4">
                          {profile.website && (
                            <Button variant="outline" asChild>
                              <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer">
                                <Globe className="h-4 w-4 mr-2" />
                                Website
                              </a>
                            </Button>
                          )}
                          {profile.linkedin && (
                            <Button variant="outline" asChild>
                              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="h-4 w-4 mr-2" />
                                LinkedIn
                              </a>
                            </Button>
                          )}
                          {profile.twitter && (
                            <Button variant="outline" asChild>
                              <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer">
                                <Twitter className="h-4 w-4 mr-2" />
                                Twitter
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-medium text-foreground mb-3">Email</h3>
                        <div className="flex items-center p-3 bg-muted rounded-lg">
                          <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span className="text-sm">{profile.user.email}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Note: Direct email communication is reserved for established connections
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pitch Guidelines */}
              {profile.is_accepting_pitches && (
                <Card className="shadow-card">
                  <CardHeader>
                    <h2 className="text-lg font-heading font-semibold text-foreground flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                      Pitch Guidelines
                    </h2>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Looking for: {profile.focus_industries?.join(', ') || 'Various industries'}
                      </p>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <div className="mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Investment range: {formatInvestmentRange(
                          profile.investment_range_min, 
                          profile.investment_range_max
                        )}
                      </p>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <div className="mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Stages: {profile.investment_stages?.join(', ') || 'Various stages'}
                      </p>
                    </div>
                    
                    {isAuthenticated && authUser?.role === 'artist' ? (
                      <div className="pt-2">
                        <ContactModal 
                          recipientName={`${profile.user.first_name} ${profile.user.last_name}`}
                          recipientType="investor"
                          triggerText="Send Your Pitch"
                          triggerVariant="default"
                          triggerClassName="w-full"
                          investorId={profile.id}
                        />
                      </div>
                    ) : (
                      <div className="pt-2">
                        <Button asChild className="w-full">
                          <Link to="/auth?role=artist">
                            Sign Up to Pitch
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Investor Type */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-lg font-heading font-semibold text-foreground">Investor Type</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {getInvestorTypeLabel(profile.investor_type)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {profile.investor_type === 'angel' ? 'Individual investor funding early-stage startups' :
                         profile.investor_type === 'vc' ? 'Professional firm investing in high-growth companies' :
                         profile.investor_type === 'corporate' ? 'Corporate investment arm' :
                         'Investment organization'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-lg font-heading font-semibold text-foreground">Location</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">{profile.location}</div>
                      <p className="text-xs text-muted-foreground">Primary operating location</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Membership */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-lg font-heading font-semibold text-foreground">Thryve Member</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Verified Investor</div>
                      <p className="text-xs text-muted-foreground">
                        Member since {formatDate(profile.created_at)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tips for Artists */}
          {isAuthenticated && authUser?.role === 'artist' && (
            <div className="mt-12">
              <Card className="shadow-card bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardHeader>
                  <h2 className="text-xl font-heading font-semibold text-foreground">Pitching Tips</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <h3 className="font-medium text-foreground">Be Prepared</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Have a clear project description</li>
                        <li>• Prepare financial projections</li>
                        <li>• Know your funding needs</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-foreground">Be Specific</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Explain how funds will be used</li>
                        <li>• Show timeline and milestones</li>
                        <li>• Highlight your unique value</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-foreground">Be Professional</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Respond promptly to inquiries</li>
                        <li>• Provide requested documents</li>
                        <li>• Follow up appropriately</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ViewInvestorProfile
