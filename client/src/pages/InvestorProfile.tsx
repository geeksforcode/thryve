import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  MapPin, Mail, Phone, Edit, DollarSign, TrendingUp, 
  Building, Target, Users, Award, Globe, Linkedin, 
  Twitter, Save, X, Loader2, ExternalLink, Briefcase,
  Calendar, Plus, AlertCircle, UserPlus
} from "lucide-react"
import Navigation from "@/components/Navigation"
import ContactModal from "@/components/modals/ContactModal"
import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { 
  getInvestorDetail, 
  getInvestorProfile, 
  updateInvestorProfile,
  getInvestments,
  getInvestorStats,
  trackInteraction,
  createInvestorProfile
} from "@/services/apiClient"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

const InvestorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [profile, setProfile] = useState<InvestorProfileType | null>(null);
  const [profileExists, setProfileExists] = useState(true);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [stats, setStats] = useState<InvestorStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Edit form state
  const [editData, setEditData] = useState({
    bio: '',
    position: '',
    company: '',
    location: '',
    website: '',
    linkedin: '',
    twitter: '',
    investment_range_min: '',
    investment_range_max: '',
    focus_industries: [] as string[],
    investment_stages: [] as string[],
    is_accepting_pitches: false,
  });

  const isOwnProfile = !id; // If no ID in URL, it's the user's own profile

  useEffect(() => {
    const loadInvestorProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        setProfileExists(true);
        
        if (isOwnProfile) {
          // Load own profile
          if (!isAuthenticated) {
            navigate('/auth');
            return;
          }
          
          try {
            const profileData = await getInvestorProfile();
            setProfile(profileData);
            
            // Initialize edit data
            setEditData({
              bio: profileData.bio || '',
              position: profileData.position || '',
              company: profileData.company || '',
              location: profileData.location || '',
              website: profileData.website || '',
              linkedin: profileData.linkedin || '',
              twitter: profileData.twitter || '',
              investment_range_min: profileData.investment_range_min || '',
              investment_range_max: profileData.investment_range_max || '',
              focus_industries: profileData.focus_industries || [],
              investment_stages: profileData.investment_stages || [],
              is_accepting_pitches: profileData.is_accepting_pitches || false,
            });

            // Load investments if it's own profile
            try {
              const investmentsData = await getInvestments();
              setInvestments(Array.isArray(investmentsData) ? investmentsData : []);
              
              const statsData = await getInvestorStats();
              setStats(statsData);
            } catch (err) {
              console.error('Failed to load additional data:', err);
            }
            
          } catch (err: any) {
            if (err.message.includes('not found') || err.message.includes('404')) {
              // Profile doesn't exist yet
              setProfileExists(false);
              setProfile(null);
            } else {
              throw err;
            }
          }
        } else {
          // Load public profile
          const profileData = await getInvestorDetail(parseInt(id!));
          setProfile(profileData);
          
          // Track view interaction if authenticated and artist
          if (isAuthenticated && authUser?.role === 'artist') {
            try {
              await trackInteraction(profileData.id, 'viewed');
            } catch (err) {
              console.error('Failed to track interaction:', err);
            }
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
  }, [id, isOwnProfile, isAuthenticated, navigate, authUser]);

  const handleCreateProfile = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    try {
      setCreating(true);
      
      const defaultProfileData = {
        bio: editData.bio || "Welcome to my investor profile! I'm passionate about supporting creative projects and innovative ideas.",
        position: editData.position || "Investor",
        company: editData.company || "",
        location: editData.location || "",
        website: editData.website || "",
        linkedin: editData.linkedin || "",
        twitter: editData.twitter || "",
        investment_range_min: editData.investment_range_min || "10000",
        investment_range_max: editData.investment_range_max || "100000",
        focus_industries: editData.focus_industries.length > 0 ? editData.focus_industries : ["Creative Tech", "Art & Design"],
        investment_stages: editData.investment_stages.length > 0 ? editData.investment_stages : ["Seed", "Early Stage"],
        is_accepting_pitches: true,
        investor_type: "angel",
      };
      
      const createdProfile = await createInvestorProfile(defaultProfileData);
      setProfile(createdProfile);
      setProfileExists(true);
      
      toast({
        title: "Success",
        description: "Investor profile created successfully!",
        variant: "default",
      });
      
    } catch (err: any) {
      console.error('Failed to create profile:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to create investor profile',
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    try {
      setSaving(true);
      
      // Convert numeric fields
      const dataToSend = {
        ...editData,
        investment_range_min: parseFloat(editData.investment_range_min) || 0,
        investment_range_max: parseFloat(editData.investment_range_max) || 0,
      };
      
      await updateInvestorProfile(dataToSend);
      
      // Update local profile
      setProfile({
        ...profile,
        ...dataToSend
      });
      
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default",
      });
      
    } catch (err: any) {
      console.error('Failed to save profile:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to save profile',
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (profile) {
      setEditData({
        bio: profile.bio || '',
        position: profile.position || '',
        company: profile.company || '',
        location: profile.location || '',
        website: profile.website || '',
        linkedin: profile.linkedin || '',
        twitter: profile.twitter || '',
        investment_range_min: profile.investment_range_min || '',
        investment_range_max: profile.investment_range_max || '',
        focus_industries: profile.focus_industries || [],
        investment_stages: profile.investment_stages || [],
        is_accepting_pitches: profile.is_accepting_pitches || false,
      });
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

  const getInvestmentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'equity': 'Equity',
      'debt': 'Debt',
      'convertible_note': 'Convertible Note',
      'grant': 'Grant',
      'royalty': 'Royalty Agreement',
      'other': 'Other',
    };
    return types[type] || type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Show loading state
  if (loading && isOwnProfile && profileExists) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex flex-col justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  // Show create profile UI if profile doesn't exist
  if (isOwnProfile && !profileExists && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Welcome Card for New Investors */}
            <Card className="shadow-card mb-8">
              <CardHeader>
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <UserPlus className="h-16 w-16 text-primary" />
                  </div>
                  <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                    Welcome to Thryve, {authUser?.first_name}!
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Create your investor profile to discover and support talented artists
                  </p>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="text-center space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">
                      Set up your investor profile
                    </h2>
                    <p className="text-muted-foreground">
                      Tell artists about your investment focus and preferences
                    </p>
                  </div>
                  
                  {/* Quick Profile Setup Form */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="setup-position">Position/Role *</Label>
                      <Input
                        id="setup-position"
                        value={editData.position}
                        onChange={(e) => setEditData({...editData, position: e.target.value})}
                        placeholder="e.g., Managing Partner, Angel Investor"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="setup-company">Company/Organization</Label>
                      <Input
                        id="setup-company"
                        value={editData.company}
                        onChange={(e) => setEditData({...editData, company: e.target.value})}
                        placeholder="e.g., ABC Ventures, Independent"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="setup-bio">Bio</Label>
                      <Textarea
                        id="setup-bio"
                        value={editData.bio}
                        onChange={(e) => setEditData({...editData, bio: e.target.value})}
                        placeholder="Tell artists about your investment philosophy, experience, and what you look for in projects..."
                        className="min-h-32"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="setup-location">Location</Label>
                      <Input
                        id="setup-location"
                        value={editData.location}
                        onChange={(e) => setEditData({...editData, location: e.target.value})}
                        placeholder="City, Country"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="setup-min-investment">Minimum Investment</Label>
                        <Input
                          id="setup-min-investment"
                          type="number"
                          value={editData.investment_range_min}
                          onChange={(e) => setEditData({...editData, investment_range_min: e.target.value})}
                          placeholder="e.g., 10000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="setup-max-investment">Maximum Investment</Label>
                        <Input
                          id="setup-max-investment"
                          type="number"
                          value={editData.investment_range_max}
                          onChange={(e) => setEditData({...editData, investment_range_max: e.target.value})}
                          placeholder="e.g., 100000"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="setup-focus-areas">Focus Areas (comma separated)</Label>
                      <Input
                        id="setup-focus-areas"
                        value={editData.focus_industries.join(', ')}
                        onChange={(e) => setEditData({
                          ...editData, 
                          focus_industries: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                        })}
                        placeholder="e.g., Creative Tech, Digital Art, Animation"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="setup-investment-stages">Investment Stages (comma separated)</Label>
                      <Input
                        id="setup-investment-stages"
                        value={editData.investment_stages.join(', ')}
                        onChange={(e) => setEditData({
                          ...editData, 
                          investment_stages: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                        })}
                        placeholder="e.g., Seed, Series A, Pre-Series A"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="setup-accepting-pitches"
                        checked={editData.is_accepting_pitches}
                        onChange={(e) => setEditData({...editData, is_accepting_pitches: e.target.checked})}
                        className="rounded"
                      />
                      <Label htmlFor="setup-accepting-pitches">
                        Available to receive pitches from artists
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4 pt-4">
                    <Button 
                      onClick={handleCreateProfile}
                      disabled={creating || !editData.position}
                      size="lg"
                      className="min-w-40 bg-gradient-primary"
                    >
                      {creating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Investor Profile
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      asChild
                      size="lg"
                    >
                      <Link to="/listings/investors">
                        Browse Other Investors
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground pt-4">
                    <p>You can add more details, social links, and portfolio companies later</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Benefits Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-center font-semibold">Discover Artists</h3>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                  Find talented artists and creative projects that match your investment criteria
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-center font-semibold">Receive Pitches</h3>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                  Get pitch requests from artists who need funding for their creative projects
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-center font-semibold">Build Portfolio</h3>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                  Track your investments and build a portfolio of successful creative projects
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error for public profiles not found
  if (!profile && !isOwnProfile) {
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
            {isAuthenticated && (
              <Button asChild variant="outline">
                <Link to="/profile/investor">View Your Profile</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If we have a profile, render it normally
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
          
          {/* Investor Header */}
          <Card className="shadow-card mb-8">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <Avatar className="w-24 h-24 lg:w-32 lg:h-32 mx-auto sm:mx-0">
                    <AvatarImage 
                      src={profile!.user.profile_picture} 
                      alt={`${profile!.user.first_name} ${profile!.user.last_name}`} 
                    />
                    <AvatarFallback className="text-xl lg:text-2xl">
                      {getInitials(profile!.user.first_name, profile!.user.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center sm:text-left space-y-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
                        {profile!.user.first_name} {profile!.user.last_name}
                      </h1>
                      {isEditing ? (
                        <div className="space-y-2 mb-3">
                          <Input
                            value={editData.position}
                            onChange={(e) => setEditData({...editData, position: e.target.value})}
                            placeholder="Position"
                            className="max-w-md"
                          />
                          <Input
                            value={editData.company}
                            onChange={(e) => setEditData({...editData, company: e.target.value})}
                            placeholder="Company"
                            className="max-w-md"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-lg lg:text-xl text-primary font-medium mb-1">
                            {profile!.position}
                          </p>
                          <p className="text-base lg:text-lg text-muted-foreground font-medium mb-3">
                            {profile!.company}
                          </p>
                        </>
                      )}
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-muted-foreground text-sm lg:text-base">
                        {isEditing ? (
                          <div className="flex items-center justify-center sm:justify-start">
                            <Input
                              value={editData.location}
                              onChange={(e) => setEditData({...editData, location: e.target.value})}
                              placeholder="Location"
                              className="w-48"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center sm:justify-start">
                            <MapPin className="h-4 w-4 mr-2" />
                            {profile!.location}
                          </div>
                        )}
                        <div className="flex items-center justify-center sm:justify-start">
                          <DollarSign className="h-4 w-4 mr-2" />
                          {formatInvestmentRange(
                            profile!.investment_range_min, 
                            profile!.investment_range_max
                          )}
                        </div>
                        <div className="flex items-center justify-center sm:justify-start">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          <Badge variant="secondary">
                            {getInvestorTypeLabel(profile!.investor_type)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 lg:gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-foreground">
                          {formatCurrency(profile!.total_portfolio_value)}
                        </div>
                        <div className="text-muted-foreground">Portfolio Value</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{profile!.total_investments}</div>
                        <div className="text-muted-foreground">Investments</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{profile!.successful_exits}</div>
                        <div className="text-muted-foreground">Exits</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">
                          {formatCurrency(profile!.avg_ticket_size)}
                        </div>
                        <div className="text-muted-foreground">Avg Ticket</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="default"
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={saving}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      {isOwnProfile && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                      {!isOwnProfile && profile!.is_accepting_pitches && (
                        <ContactModal 
                          recipientName={`${profile!.user.first_name} ${profile!.user.last_name}`}
                          recipientType="investor"
                          triggerText="Pitch Idea"
                          triggerVariant="default"
                          investorId={profile!.id}
                        />
                      )}
                    </>
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
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-heading font-semibold text-foreground">About</h2>
                    {isOwnProfile && !isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea 
                      value={editData.bio}
                      onChange={(e) => setEditData({...editData, bio: e.target.value})}
                      className="min-h-32"
                      placeholder="Tell us about your investment philosophy..."
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {profile!.bio || "No bio available."}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Portfolio Companies / Investments */}
              {(investments.length > 0 || isOwnProfile) && (
                <Card className="shadow-card">
                  <CardHeader>
                    <h2 className="text-xl font-heading font-semibold text-foreground flex items-center">
                      <Building className="h-5 w-5 mr-2 text-primary" />
                      {isOwnProfile ? 'Your Investments' : 'Portfolio Companies'}
                    </h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {investments.length > 0 ? (
                      investments.map((investment) => (
                        <Card key={investment.id} className="border border-border">
                          <CardContent className="p-4 lg:p-6">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-3 lg:space-y-0">
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-semibold text-foreground">
                                    {investment.project_name}
                                  </h3>
                                  <Badge variant="outline" className="text-xs">
                                    {getInvestmentTypeLabel(investment.investment_type)}
                                  </Badge>
                                  <Badge variant={investment.is_active ? "secondary" : "outline"} className="text-xs">
                                    {investment.is_active ? 'Active' : 'Exited'}
                                  </Badge>
                                  {investment.is_successful && (
                                    <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                      Successful
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-muted-foreground text-sm line-clamp-2">
                                  {investment.project_description}
                                </p>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Briefcase className="h-3 w-3 mr-1" />
                                  {investment.artist.user.first_name} {investment.artist.user.last_name}
                                </div>
                              </div>
                              <div className="flex flex-col lg:items-end space-y-1 text-sm">
                                <span className="font-medium text-primary">
                                  {formatCurrency(investment.amount)}
                                </span>
                                <div className="flex items-center text-muted-foreground">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(investment.investment_date)}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        {isOwnProfile 
                          ? "You haven't made any investments yet." 
                          : "No investment information available."}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Social Links */}
              {(profile!.website || profile!.linkedin || profile!.twitter) && (
                <Card className="shadow-card">
                  <CardHeader>
                    <h2 className="text-xl font-heading font-semibold text-foreground">Connect</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      {profile!.website && (
                        <Button variant="outline" asChild>
                          <a href={profile!.website.startsWith('http') ? profile!.website : `https://${profile!.website}`} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4 mr-2" />
                            Website
                          </a>
                        </Button>
                      )}
                      {profile!.linkedin && (
                        <Button variant="outline" asChild>
                          <a href={profile!.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {profile!.twitter && (
                        <Button variant="outline" asChild>
                          <a href={`https://twitter.com/${profile!.twitter}`} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4 mr-2" />
                            Twitter
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Investment Focus */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-lg font-heading font-semibold text-foreground flex items-center">
                    <Target className="h-4 w-4 mr-2 text-primary" />
                    Investment Focus
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">FOCUS AREAS</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {isEditing ? (
                          <Input
                            value={editData.focus_industries.join(', ')}
                            onChange={(e) => setEditData({
                              ...editData, 
                              focus_industries: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                            })}
                            placeholder="Creative Tech, AI/ML, Gaming"
                          />
                        ) : (
                          profile!.focus_industries && profile!.focus_industries.length > 0 ? (
                            profile!.focus_industries.map((area) => (
                              <Badge key={area} variant="secondary" className="text-xs">
                                {area}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">Not specified</p>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">INVESTMENT STAGE</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {isEditing ? (
                          <Input
                            value={editData.investment_stages.join(', ')}
                            onChange={(e) => setEditData({
                              ...editData, 
                              investment_stages: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                            })}
                            placeholder="Seed, Series A, Pre-Series A"
                          />
                        ) : (
                          profile!.investment_stages && profile!.investment_stages.length > 0 ? (
                            profile!.investment_stages.map((stage) => (
                              <Badge key={stage} variant="outline" className="text-xs">
                                {stage}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">Not specified</p>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">TICKET SIZE</Label>
                      <div className="mt-1">
                        {isEditing ? (
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              value={editData.investment_range_min}
                              onChange={(e) => setEditData({...editData, investment_range_min: e.target.value})}
                              placeholder="Min"
                              type="number"
                              step="1000"
                            />
                            <Input
                              value={editData.investment_range_max}
                              onChange={(e) => setEditData({...editData, investment_range_max: e.target.value})}
                              placeholder="Max"
                              type="number"
                              step="1000"
                            />
                          </div>
                        ) : (
                          <span className="font-medium text-primary">
                            {formatInvestmentRange(
                              profile!.investment_range_min, 
                              profile!.investment_range_max
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_accepting_pitches"
                          checked={editData.is_accepting_pitches}
                          onChange={(e) => setEditData({...editData, is_accepting_pitches: e.target.checked})}
                          className="rounded"
                        />
                        <Label htmlFor="is_accepting_pitches" className="text-sm">
                          Accepting new pitches
                        </Label>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-lg font-heading font-semibold text-foreground">Contact Information</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          value={profile!.user.email} 
                          disabled 
                          className="bg-muted"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input 
                          id="website" 
                          value={editData.website} 
                          onChange={(e) => setEditData({...editData, website: e.target.value})}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input 
                          id="linkedin" 
                          value={editData.linkedin} 
                          onChange={(e) => setEditData({...editData, linkedin: e.target.value})}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input 
                          id="twitter" 
                          value={editData.twitter} 
                          onChange={(e) => setEditData({...editData, twitter: e.target.value})}
                          placeholder="@username"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span className="text-sm">{profile!.user.email}</span>
                      </div>
                      {profile!.website && (
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-3 text-muted-foreground" />
                          <a 
                            href={profile!.website.startsWith('http') ? profile!.website : `https://${profile!.website}`}
                            className="text-sm text-primary hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Website
                          </a>
                        </div>
                      )}
                      {profile!.linkedin && (
                        <div className="flex items-center">
                          <Linkedin className="h-4 w-4 mr-3 text-muted-foreground" />
                          <a 
                            href={profile!.linkedin}
                            className="text-sm text-primary hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            LinkedIn
                          </a>
                        </div>
                      )}
                      {profile!.twitter && (
                        <div className="flex items-center">
                          <Twitter className="h-4 w-4 mr-3 text-muted-foreground" />
                          <a 
                            href={`https://twitter.com/${profile!.twitter}`}
                            className="text-sm text-primary hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            @{profile!.twitter}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              {stats && (
                <Card className="shadow-card">
                  <CardHeader>
                    <h2 className="text-lg font-heading font-semibold text-foreground">Investment Activity</h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Investments</span>
                      <span className="font-semibold">{stats.active_investments}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Pending Pitches</span>
                      <span className="font-semibold">{stats.pending_pitches}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Success Rate</span>
                      <span className="font-semibold text-green-600">
                        {profile!.total_investments > 0 
                          ? Math.round((profile!.successful_exits / profile!.total_investments) * 100) 
                          : 0}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 flex justify-end space-x-4">
              <Button variant="outline" onClick={handleCancelEdit} disabled={saving}>
                Cancel
              </Button>
              <Button 
                className="bg-gradient-primary hover:opacity-90" 
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default InvestorProfile
