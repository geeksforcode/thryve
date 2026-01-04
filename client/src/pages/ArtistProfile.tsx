import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Mail,
  Phone,
  Edit,
  Plus,
  Heart,
  Eye,
  ExternalLink,
  Loader2,
  Globe,
  Instagram,
  MessageSquare,
  Star,
  Users,
  Award,
  Calendar,
  Save,
  X,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  getArtistDetail, 
  getArtistProfile,
  likeArtist, 
  followArtist,
  likePortfolioItem,
  requestCommission,
  updateArtistProfile,
  createPortfolioItem, // ADDED
} from "@/services/apiClient"; // UPDATED IMPORTS
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

interface ArtistProfile {
  id: number;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture?: string;
  };
  bio: string;
  category: string;
  specialty: string;
  location: string;
  website: string;
  instagram: string;
  behance: string;
  dribbble: string;
  youtube: string;
  rating: string | number | null;
  followers_count: number;
  total_likes: number;
  total_views: number;
  is_available: boolean;
  hourly_rate: string | number | null;
  project_rate: string | number | null;
  created_at: string;
  updated_at: string;
  skills: Array<{
    id: number;
    name: string;
    level: string;
  }>;
  experiences: Array<{
    id: number;
    role: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string | null;
    current: boolean;
    description: string;
  }>;
  portfolio_items: Array<{
    id: number;
    title: string;
    description: string;
    category: string;
    image: string | null;
    video_url: string;
    year_created: number | null;
    client: string;
    project_url: string;
    likes_count: number;
    views_count: number;
    is_featured: boolean;
    is_visible: boolean;
    tags: Array<{
      id: number;
      name: string;
    }>;
    created_at: string;
  }>;
}

interface CommissionData {
  title: string;
  description: string;
  category: string;
  deadline: string;
  budget: string;
  reference_images: string;
}

interface EditProfileData {
  bio: string;
  specialty: string;
  location: string;
  website: string;
  instagram: string;
  behance: string;
  dribbble: string;
  youtube: string;
  is_available: boolean;
  hourly_rate: number | null;
  project_rate: number | null;
  category?: string;
}

const ArtistProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [portfolioLikes, setPortfolioLikes] = useState<number[]>([]);
  const [showCommissionDialog, setShowCommissionDialog] = useState(false);
  const [commissionData, setCommissionData] = useState<CommissionData>({
    title: '',
    description: '',
    category: '',
    deadline: '',
    budget: '',
    reference_images: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditProfileData>({
    bio: '',
    specialty: '',
    location: '',
    website: '',
    instagram: '',
    behance: '',
    dribbble: '',
    youtube: '',
    is_available: false,
    hourly_rate: null,
    project_rate: null,
    category: 'digital_art',
  });
  const [saving, setSaving] = useState(false);
  
  // Profile creation states
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [showCreateProfileDialog, setShowCreateProfileDialog] = useState(false);
  
  // Add Portfolio Dialog states
  const [showAddPortfolioDialog, setShowAddPortfolioDialog] = useState(false);
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: '',
    description: '',
    category: 'character_design',
    image: null as File | null,
    video_file: null as File | null, // ADDED: matches apiClient field name
    year_created: '',
    client: '',
    project_url: '',
    tags: [] as string[],
    is_featured: false,
  });
  const [addingPortfolio, setAddingPortfolio] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Determine if this is a public profile or own profile
  const isPublicProfile = !!username;
  const isOwnProfile = !username;
  
  // For public profiles, use the username from params
  const targetUsername = username;

  // Debug logging
  console.log("🎨 ArtistProfile component rendered");
  console.log("📝 Username from params:", username);
  console.log("👤 Auth user:", user);
  console.log("🔐 Is authenticated:", isAuthenticated);
  console.log("👁️ Profile type:", isPublicProfile ? "Public Profile" : "Own Profile");
  console.log("🎯 Target username:", targetUsername);

  useEffect(() => {
    const loadArtistProfile = async () => {
      console.log("🔍 Loading profile logic started");
      
      if (isOwnProfile) {
        if (!isAuthenticated) {
          console.log("🔒 Not authenticated, redirecting to auth");
          navigate('/auth');
          return;
        }
        
        try {
          setLoading(true);
          setError(null);
          console.log("📋 Loading own artist profile");
          
          const data = await getArtistProfile();
          console.log("✅ Own artist profile data loaded:", data);
          
          const profileData = {
            ...data,
            rating: data.rating || 0,
          };
          
          setProfile(profileData);
          
          // Initialize edit data
          setEditData({
            bio: data.bio || '',
            specialty: data.specialty || '',
            location: data.location || '',
            website: data.website || '',
            instagram: data.instagram || '',
            behance: data.behance || '',
            dribbble: data.dribbble || '',
            youtube: data.youtube || '',
            is_available: data.is_available || false,
            hourly_rate: data.hourly_rate ? Number(data.hourly_rate) : null,
            project_rate: data.project_rate ? Number(data.project_rate) : null,
            category: data.category || 'digital_art',
          });
          
        } catch (error: any) {
          console.log("⚠️ Own profile not found or error:", error.message);
          
          if (error.message.includes("not found") || error.message.includes("404")) {
            setProfile(null);
            setError("You don't have an artist profile yet. Please create one.");
          } else {
            setError(error.message || "Failed to load your profile. Please try again.");
            setProfile(null);
          }
        } finally {
          setLoading(false);
        }
      } else {
        if (!targetUsername) {
          setError("No artist specified");
          setLoading(false);
          return;
        }
        
        try {
          setLoading(true);
          setError(null);
          console.log(`📋 Loading public profile: ${targetUsername}`);
          
          const data = await getArtistDetail(targetUsername);
          console.log("✅ Public artist profile data loaded:", data);
          
          const profileData = {
            ...data,
            rating: data.rating || 0,
          };
          
          setProfile(profileData);
          
          setEditData({
            bio: data.bio || '',
            specialty: data.specialty || '',
            location: data.location || '',
            website: data.website || '',
            instagram: data.instagram || '',
            behance: data.behance || '',
            dribbble: data.dribbble || '',
            youtube: data.youtube || '',
            is_available: data.is_available || false,
            hourly_rate: data.hourly_rate ? Number(data.hourly_rate) : null,
            project_rate: data.project_rate ? Number(data.project_rate) : null,
            category: data.category || 'digital_art',
          });
          
        } catch (error: any) {
          console.error('❌ Failed to load artist profile:', error);
          setError(error.message || "Failed to load artist profile. Please try again.");
          setProfile(null);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadArtistProfile();
  }, [targetUsername, isOwnProfile, navigate, isAuthenticated]);

  // UPDATED: Add Portfolio Item Handler to use apiClient function
  const handleAddPortfolioItem = async () => {
    try {
      setAddingPortfolio(true);
      
      // Prepare data for API - matches apiClient structure
      const portfolioData: any = {
        title: newPortfolioItem.title,
        description: newPortfolioItem.description,
        category: newPortfolioItem.category,
        is_featured: newPortfolioItem.is_featured,
      };
      
      // Add optional fields if they exist
      if (newPortfolioItem.image) {
        portfolioData.image = newPortfolioItem.image;
      }
      
      if (newPortfolioItem.video_file) {
        portfolioData.video_file = newPortfolioItem.video_file;
      }
      
      if (newPortfolioItem.year_created) {
        portfolioData.year_created = newPortfolioItem.year_created;
      }
      
      if (newPortfolioItem.client) {
        portfolioData.client = newPortfolioItem.client;
      }
      
      if (newPortfolioItem.project_url) {
        portfolioData.project_url = newPortfolioItem.project_url;
      }
      
      // Add tags
      if (newPortfolioItem.tags.length > 0) {
        portfolioData.tags = newPortfolioItem.tags;
      }
      
      // Use the imported API function
      const data = await createPortfolioItem(portfolioData);
      
      // Update local state with new item
      if (profile) {
        setProfile({
          ...profile,
          portfolio_items: [...profile.portfolio_items, data],
        });
      }
      
      // Reset form and close dialog
      setNewPortfolioItem({
        title: '',
        description: '',
        category: 'character_design',
        image: null,
        video_file: null,
        year_created: '',
        client: '',
        project_url: '',
        tags: [],
        is_featured: false,
      });
      
      setShowAddPortfolioDialog(false);
      
      // Show success message
      toast({
        title: "Success",
        description: "Portfolio item added successfully",
        variant: "default",
      });
      
    } catch (error: any) {
      console.error('Failed to add portfolio item:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add portfolio item",
        variant: "destructive",
      });
    } finally {
      setAddingPortfolio(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      'digital_art': 'Digital Art',
      'photography': 'Photography',
      'graphic_design': 'Graphic Design',
      'illustration': 'Illustration',
      'painting': 'Painting',
      'sculpture': 'Sculpture',
      'animation': 'Animation',
      'video': 'Video Production',
      'music': 'Music',
      'writing': 'Writing',
      'other': 'Other',
    };
    return categories[category] || category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getPortfolioCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      'character_design': 'Character Design',
      'concept_art': 'Concept Art',
      'digital_painting': 'Digital Painting',
      'illustration': 'Illustration',
      'graphic_design': 'Graphic Design',
      'photography': 'Photography',
      'animation': 'Animation',
      'ui_ux': 'UI/UX Design',
      'logo_branding': 'Logo & Branding',
      'print_design': 'Print Design',
      '3d_modeling': '3D Modeling',
      'vfx': 'VFX',
      'motion_graphics': 'Motion Graphics',
      'other': 'Other',
    };
    return categories[category] || category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getSkillLevelLabel = (level: string) => {
    const levels: Record<string, string> = {
      'beginner': 'Beginner',
      'intermediate': 'Intermediate',
      'advanced': 'Advanced',
      'expert': 'Expert',
    };
    return levels[level] || level;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getExperiencePeriod = (startDate: string, endDate: string | null, current: boolean) => {
    const start = new Date(startDate);
    const startFormatted = start.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    
    if (current) {
      return `${startFormatted} - Present`;
    }
    
    if (endDate) {
      const end = new Date(endDate);
      const endFormatted = end.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      return `${startFormatted} - ${endFormatted}`;
    }
    
    return startFormatted;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  // Helper function to safely format rating (handles Decimal strings)
  const formatRating = (rating: any): string => {
    if (rating === null || rating === undefined) return '0.0';
    
    const numRating = Number(rating);
    return isNaN(numRating) ? '0.0' : numRating.toFixed(1);
  };

  // Helper function for hourly rate display
  const formatHourlyRate = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    
    const numValue = Number(value);
    return isNaN(numValue) ? 'N/A' : `$${numValue.toFixed(2)}/hr`;
  };

  // Helper function for project rate display
  const formatProjectRate = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    
    const numValue = Number(value);
    return isNaN(numValue) ? 'N/A' : `From $${numValue.toFixed(2)}`;
  };

  // UPDATED: Updated to use correct endpoint structure (artist/listings/{id}/like/)
  const handleLikeArtist = async () => {
    if (!isAuthenticated) {
      navigate(`/auth?redirect=/artist/${username}`);
      return;
    }
    
    if (!profile) return;
    
    try {
      await likeArtist(profile.id);
      setLiked(!liked);
      if (profile) {
        setProfile({
          ...profile,
          total_likes: liked ? profile.total_likes - 1 : profile.total_likes + 1
        });
      }
    } catch (error) {
      console.error('Failed to like artist:', error);
    }
  };

  // UPDATED: Updated to use correct endpoint structure (artist/listings/{id}/follow/)
  const handleFollowArtist = async () => {
    if (!isAuthenticated) {
      navigate(`/auth?redirect=/artist/${username}`);
      return;
    }
    
    if (!profile) return;
    
    try {
      await followArtist(profile.id);
      setFollowing(!following);
      if (profile) {
        setProfile({
          ...profile,
          followers_count: following ? profile.followers_count - 1 : profile.followers_count + 1
        });
      }
    } catch (error) {
      console.error('Failed to follow artist:', error);
    }
  };

  // UPDATED: Updated to use correct endpoint structure (artist/portfolio/{id}/like/)
  const handleLikePortfolio = async (portfolioId: number) => {
    if (!isAuthenticated) {
      navigate(`/auth?redirect=/artist/${username}`);
      return;
    }
    
    try {
      await likePortfolioItem(portfolioId);
      if (portfolioLikes.includes(portfolioId)) {
        setPortfolioLikes(portfolioLikes.filter(id => id !== portfolioId));
        if (profile) {
          setProfile({
            ...profile,
            portfolio_items: profile.portfolio_items.map(item => 
              item.id === portfolioId 
                ? { ...item, likes_count: item.likes_count - 1 }
                : item
            ),
            total_likes: profile.total_likes - 1
          });
        }
      } else {
        setPortfolioLikes([...portfolioLikes, portfolioId]);
        if (profile) {
          setProfile({
            ...profile,
            portfolio_items: profile.portfolio_items.map(item => 
              item.id === portfolioId 
                ? { ...item, likes_count: item.likes_count + 1 }
                : item
            ),
            total_likes: profile.total_likes + 1
          });
        }
      }
    } catch (error) {
      console.error('Failed to like portfolio item:', error);
    }
  };

  const handleRequestCommission = async () => {
    if (!isAuthenticated) {
      navigate(`/auth?redirect=/artist/${username}`);
      return;
    }
    
    if (!profile) return;
    
    setShowCommissionDialog(true);
  };

  // UPDATED: Updated to use correct endpoint structure (artist/listings/{id}/commission/)
  const handleSubmitCommission = async () => {
    if (!profile) return;
    
    try {
      setSubmitting(true);
      await requestCommission(profile.id, commissionData);
      
      toast({
        title: "Success",
        description: "Commission request sent successfully!",
        variant: "default",
      });
      
      setShowCommissionDialog(false);
      setCommissionData({
        title: '',
        description: '',
        category: '',
        deadline: '',
        budget: '',
        reference_images: '',
      });
    } catch (error: any) {
      console.error('Failed to request commission:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to send commission request. Please try again.',
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewPortfolio = (item: any) => {
    setSelectedPortfolio(item);
    setShowPortfolioModal(true);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!profile && !isOwnProfile) return;
    
    try {
      setSaving(true);
      
      const updatedProfile = await updateArtistProfile(editData);
      
      if (profile) {
        setProfile({
          ...profile,
          ...updatedProfile
        });
      } else {
        const profileData = await getArtistProfile();
        setProfile(profileData);
      }
      
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Profile saved successfully!",
        variant: "default",
      });
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to save profile. Please try again.',
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
        specialty: profile.specialty || '',
        location: profile.location || '',
        website: profile.website || '',
        instagram: profile.instagram || '',
        behance: profile.behance || '',
        dribbble: profile.dribbble || '',
        youtube: profile.youtube || '',
        is_available: profile.is_available || false,
        hourly_rate: profile.hourly_rate ? Number(profile.hourly_rate) : null,
        project_rate: profile.project_rate ? Number(profile.project_rate) : null,
        category: profile.category || 'digital_art',
      });
    }
  };

  const handleCreateProfile = async () => {
    try {
      setCreatingProfile(true);
      
      const defaultProfileData = {
        bio: editData.bio || "Welcome to my artist profile!",
        specialty: editData.specialty || "Digital Artist",
        location: editData.location || "",
        category: editData.category || "digital_art",
        is_available: editData.is_available || true,
        website: editData.website || "",
        instagram: editData.instagram || "",
        behance: editData.behance || "",
        dribbble: editData.dribbble || "",
        youtube: editData.youtube || "",
        hourly_rate: editData.hourly_rate,
        project_rate: editData.project_rate,
      };
      
      const createdProfile = await updateArtistProfile(defaultProfileData);
      console.log("✅ Profile created:", createdProfile);
      
      const profileData = await getArtistProfile();
      setProfile(profileData);
      setError(null);
      
      setEditData({
        bio: profileData.bio || '',
        specialty: profileData.specialty || '',
        location: profileData.location || '',
        website: profileData.website || '',
        instagram: profileData.instagram || '',
        behance: profileData.behance || '',
        dribbble: profileData.dribbble || '',
        youtube: profileData.youtube || '',
        is_available: profileData.is_available || false,
        hourly_rate: profileData.hourly_rate ? Number(profileData.hourly_rate) : null,
        project_rate: profileData.project_rate ? Number(profileData.project_rate) : null,
        category: profileData.category || 'digital_art',
      });
      
    } catch (error: any) {
      console.error('❌ Failed to create profile:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to create profile. Please try again.',
        variant: "destructive",
      });
    } finally {
      setCreatingProfile(false);
    }
  };

  const getPortfolioCategories = () => {
    return [
      { value: 'character_design', label: 'Character Design' },
      { value: 'concept_art', label: 'Concept Art' },
      { value: 'digital_painting', label: 'Digital Painting' },
      { value: 'illustration', label: 'Illustration' },
      { value: 'graphic_design', label: 'Graphic Design' },
      { value: 'photography', label: 'Photography' },
      { value: 'animation', label: 'Animation' },
      { value: 'ui_ux', label: 'UI/UX Design' },
      { value: 'logo_branding', label: 'Logo & Branding' },
      { value: 'print_design', label: 'Print Design' },
      { value: '3d_modeling', label: '3D Modeling' },
      { value: 'vfx', label: 'VFX' },
      { value: 'motion_graphics', label: 'Motion Graphics' },
      { value: 'other', label: 'Other' },
    ];
  };

  const getArtistCategories = () => {
    return [
      { value: 'digital_art', label: 'Digital Art' },
      { value: 'photography', label: 'Photography' },
      { value: 'graphic_design', label: 'Graphic Design' },
      { value: 'illustration', label: 'Illustration' },
      { value: 'painting', label: 'Painting' },
      { value: 'sculpture', label: 'Sculpture' },
      { value: 'animation', label: 'Animation' },
      { value: 'video', label: 'Video Production' },
      { value: 'music', label: 'Music' },
      { value: 'writing', label: 'Writing' },
      { value: 'other', label: 'Other' },
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex flex-col justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">
            {isOwnProfile ? "Loading your profile..." : "Loading artist profile..."}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {isOwnProfile ? "Own Profile" : `Username: ${targetUsername}`}
          </p>
          {error && (
            <Alert variant="destructive" className="mt-4 max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    );
  }

  // Show profile creation UI when no profile exists (only for own profile)
  if (!profile && isOwnProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Welcome Card for New Artists */}
            <Card className="shadow-card mb-8">
              <CardHeader>
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Award className="h-16 w-16 text-primary" />
                  </div>
                  <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                    Welcome to Thryve, {user?.first_name}!
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Create your artist profile to showcase your work and connect with clients
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
                      Set up your artist profile
                    </h2>
                    <p className="text-muted-foreground">
                      Tell us about yourself and your art
                    </p>
                  </div>
                  
                  {/* Quick Profile Setup Form */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="setup-specialty">Specialty *</Label>
                      <Input
                        id="setup-specialty"
                        value={editData.specialty}
                        onChange={(e) => setEditData({...editData, specialty: e.target.value})}
                        placeholder="e.g., Digital Painting, Character Design"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="setup-category">Main Category *</Label>
                      <Select
                        value={editData.category}
                        onValueChange={(value) => setEditData({...editData, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your main category" />
                        </SelectTrigger>
                        <SelectContent>
                          {getArtistCategories().map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="setup-bio">Bio</Label>
                      <Textarea
                        id="setup-bio"
                        value={editData.bio}
                        onChange={(e) => setEditData({...editData, bio: e.target.value})}
                        placeholder="Tell potential clients about your art style, experience, and inspiration..."
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
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="setup-available"
                        checked={editData.is_available}
                        onChange={(e) => setEditData({...editData, is_available: e.target.checked})}
                        className="rounded"
                      />
                      <Label htmlFor="setup-available">
                        Available for commissions and work
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4 pt-4">
                    <Button 
                      onClick={handleCreateProfile}
                      disabled={creatingProfile || !editData.specialty || !editData.category}
                      size="lg"
                      className="min-w-40"
                    >
                      {creatingProfile ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Artist Profile'
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      asChild
                      size="lg"
                    >
                      <Link to="/listings/artists">
                        Browse Other Artists
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground pt-4">
                    <p>You can add more details, portfolio items, and skills later</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Benefits Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-center font-semibold">Showcase Your Work</h3>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                  Upload your portfolio to display your best work to potential clients
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-center font-semibold">Get Commissions</h3>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                  Connect with clients looking for custom artwork and creative services
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-center font-semibold">Build Your Network</h3>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                  Connect with other artists, get followers, and grow your creative community
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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
            Artist not found
          </h1>
          <p className="text-muted-foreground mt-2">
            The artist with username "{username}" does not exist or their profile is not public.
          </p>
          {error && (
            <Alert variant="destructive" className="mt-4 max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="mt-4 space-x-4">
            <Button asChild>
              <Link to="/listings/artists">Back to Artists</Link>
            </Button>
            {isAuthenticated && (
              <Button asChild variant="outline">
                <Link to="/profile/artist">View Your Profile</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If we have a profile, render it normally
  const featuredPortfolio = profile!.portfolio_items.filter(item => item.is_featured);
  const regularPortfolio = profile!.portfolio_items.filter(item => !item.is_featured);

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
          
          {/* Profile Header */}
          <Card className="shadow-card mb-8">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <Avatar className="w-32 h-32 mx-auto sm:mx-0">
                    <AvatarImage 
                      src={profile!.user.profile_picture} 
                      alt={`${profile!.user.first_name} ${profile!.user.last_name}`} 
                    />
                    <AvatarFallback className="text-2xl">
                      {getInitials(profile!.user.first_name, profile!.user.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center sm:text-left space-y-4">
                    <div>
                      <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                        {profile!.user.first_name} {profile!.user.last_name}
                      </h1>
                      {isEditing ? (
                        <div className="mb-3">
                          <Input
                            value={editData.specialty}
                            onChange={(e) => setEditData({...editData, specialty: e.target.value})}
                            placeholder="Specialty"
                            className="max-w-md"
                          />
                        </div>
                      ) : (
                        <p className="text-xl text-primary font-medium mb-3">
                          {profile!.specialty}
                        </p>
                      )}
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-muted-foreground">
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
                          <Award className="h-4 w-4 mr-2" />
                          {getCategoryLabel(profile!.category)}
                        </div>
                        {isEditing ? (
                          <div className="flex items-center justify-center sm:justify-start">
                            <Label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={editData.is_available}
                                onChange={(e) => setEditData({...editData, is_available: e.target.checked})}
                                className="mr-2"
                              />
                              <span>Available for work</span>
                            </Label>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center sm:justify-start">
                            {profile!.is_available ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Available for work
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                Not available
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 lg:gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{profile!.followers_count}</div>
                        <div className="text-muted-foreground">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{profile!.total_likes}</div>
                        <div className="text-muted-foreground">Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{profile!.total_views}</div>
                        <div className="text-muted-foreground">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{profile!.portfolio_items.length}</div>
                        <div className="text-muted-foreground">Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{formatRating(profile!.rating)}/5</div>
                        <div className="text-muted-foreground">
                          <Star className="h-3 w-3 inline text-yellow-500 mr-1" />
                          Rating
                        </div>
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
                      {!isOwnProfile && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLikeArtist}
                            className={liked ? "text-red-500 border-red-200 bg-red-50" : ""}
                          >
                            <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-red-500" : ""}`} />
                            {liked ? 'Liked' : 'Like'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleFollowArtist}
                            className={following ? "text-primary border-primary bg-primary/10" : ""}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            {following ? 'Following' : 'Follow'}
                          </Button>
                        </div>
                      )}
                      <div className="flex space-x-2">
                        {isOwnProfile && (
                          <Button 
                            variant="outline"
                            onClick={handleEditProfile}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                        )}
                        <Button 
                          className="bg-gradient-primary hover:opacity-90"
                          onClick={handleRequestCommission}
                          disabled={!profile!.is_available || isOwnProfile}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {isOwnProfile ? 'Your Profile' : (profile!.is_available ? 'Request Commission' : 'Not Available')}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Bio */}
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-heading font-semibold text-foreground">
                      About
                    </h2>
                    {isOwnProfile && !isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditProfile}
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
                      placeholder="Tell us about yourself..."
                      className="min-h-32"
                    />
                  ) : (
                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                      {profile!.bio || "No biography available."}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              {profile!.skills && profile!.skills.length > 0 && (
                <Card className="shadow-card">
                  <CardHeader>
                    <h2 className="text-lg font-heading font-semibold text-foreground">
                      Skills
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profile!.skills.map((skill) => (
                        <div key={skill.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-muted-foreground">
                              {getSkillLevelLabel(skill.level)}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: skill.level === 'expert' ? '100%' :
                                       skill.level === 'advanced' ? '80%' :
                                       skill.level === 'intermediate' ? '60%' : '40%'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Experience */}
              {profile!.experiences && profile!.experiences.length > 0 && (
                <Card className="shadow-card">
                  <CardHeader>
                    <h2 className="text-lg font-heading font-semibold text-foreground">
                      Experience
                    </h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile!.experiences.map((exp) => (
                      <div key={exp.id} className="border-l-2 border-primary pl-3">
                        <h4 className="font-medium text-foreground text-sm">
                          {exp.role}
                        </h4>
                        <p className="text-primary text-sm font-medium">
                          {exp.company}
                        </p>
                        <p className="text-xs text-muted-foreground mb-1">
                          {getExperiencePeriod(exp.start_date, exp.end_date, exp.current)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Contact & Links */}
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-heading font-semibold text-foreground">
                      Contact & Links
                    </h2>
                    {isOwnProfile && !isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditProfile}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span className="text-sm">{profile!.user.email}</span>
                  </div>
                  
                  {isEditing ? (
                    <>
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-3 text-muted-foreground" />
                        <Input
                          value={editData.website}
                          onChange={(e) => setEditData({...editData, website: e.target.value})}
                          placeholder="Website URL"
                          size="sm"
                        />
                      </div>
                      <div className="flex items-center">
                        <Instagram className="h-4 w-4 mr-3 text-muted-foreground" />
                        <Input
                          value={editData.instagram}
                          onChange={(e) => setEditData({...editData, instagram: e.target.value})}
                          placeholder="Instagram handle"
                          size="sm"
                        />
                      </div>
                      <div className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-3 text-muted-foreground" />
                        <Input
                          value={editData.behance}
                          onChange={(e) => setEditData({...editData, behance: e.target.value})}
                          placeholder="Behance handle"
                          size="sm"
                        />
                      </div>
                      <div className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-3 text-muted-foreground" />
                        <Input
                          value={editData.dribbble}
                          onChange={(e) => setEditData({...editData, dribbble: e.target.value})}
                          placeholder="Dribbble handle"
                          size="sm"
                        />
                      </div>
                      <div className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-3 text-muted-foreground" />
                        <Input
                          value={editData.youtube}
                          onChange={(e) => setEditData({...editData, youtube: e.target.value})}
                          placeholder="YouTube channel URL"
                          size="sm"
                        />
                      </div>
                    </>
                  ) : (
                    <>
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
                      
                      {profile!.instagram && (
                        <div className="flex items-center">
                          <Instagram className="h-4 w-4 mr-3 text-muted-foreground" />
                          <a 
                            href={`https://instagram.com/${profile!.instagram}`} 
                            className="text-sm text-primary hover:underline" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            Instagram
                          </a>
                        </div>
                      )}
                      
                      {profile!.behance && (
                        <div className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-3 text-muted-foreground" />
                          <a 
                            href={`https://behance.net/${profile!.behance}`} 
                            className="text-sm text-primary hover:underline" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            Behance
                          </a>
                        </div>
                      )}
                      
                      {profile!.dribbble && (
                        <div className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-3 text-muted-foreground" />
                          <a 
                            href={`https://dribbble.com/${profile!.dribbble}`} 
                            className="text-sm text-primary hover:underline" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            Dribbble
                          </a>
                        </div>
                      )}
                      
                      {profile!.youtube && (
                        <div className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-3 text-muted-foreground" />
                          <a 
                            href={profile!.youtube} 
                            className="text-sm text-primary hover:underline" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            YouTube
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Rates */}
              {(profile!.hourly_rate || profile!.project_rate) && (
                <Card className="shadow-card">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-heading font-semibold text-foreground">
                        Rates
                      </h2>
                      {isOwnProfile && !isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleEditProfile}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {isEditing ? (
                      <>
                        <div className="space-y-1">
                          <Label htmlFor="hourly_rate">Hourly Rate</Label>
                          <Input
                            id="hourly_rate"
                            type="number"
                            value={editData.hourly_rate || ''}
                            onChange={(e) => setEditData({...editData, hourly_rate: e.target.value ? Number(e.target.value) : null})}
                            placeholder="$"
                            step="0.01"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="project_rate">Project Rate (Starting From)</Label>
                          <Input
                            id="project_rate"
                            type="number"
                            value={editData.project_rate || ''}
                            onChange={(e) => setEditData({...editData, project_rate: e.target.value ? Number(e.target.value) : null})}
                            placeholder="$"
                            step="0.01"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {profile!.hourly_rate && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Hourly Rate</span>
                            <span className="font-semibold">{formatHourlyRate(profile!.hourly_rate)}</span>
                          </div>
                        )}
                        {profile!.project_rate && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Project Rate</span>
                            <span className="font-semibold">{formatProjectRate(profile!.project_rate)}</span>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Portfolio */}
            <div className="lg:col-span-3">
              {/* Portfolio Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading font-bold text-foreground">
                  Portfolio ({profile!.portfolio_items.length})
                </h2>
                {isOwnProfile && (
                  <Button onClick={() => setShowAddPortfolioDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Portfolio Item
                  </Button>
                )}
              </div>

              {/* Featured Portfolio */}
              {featuredPortfolio.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Featured Work
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {featuredPortfolio.map((item) => (
                      <Card
                        key={item.id}
                        className="shadow-card hover:shadow-card-hover transition-smooth overflow-hidden group"
                      >
                        <div className="aspect-video overflow-hidden relative">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <span className="text-muted-foreground">No preview available</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-background/90"
                              onClick={() => handleViewPortfolio(item)}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-foreground text-sm line-clamp-1">
                              {item.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className="text-xs ml-2 shrink-0"
                            >
                              {getPortfolioCategoryLabel(item.category)}
                            </Badge>
                          </div>

                          <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                            {item.description}
                          </p>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center space-x-3">
                              <button 
                                className="flex items-center hover:text-red-500 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLikePortfolio(item.id);
                                }}
                              >
                                <Heart className={`h-3 w-3 mr-1 ${portfolioLikes.includes(item.id) ? "fill-red-500 text-red-500" : ""}`} />
                                {item.likes_count}
                              </button>
                              <div className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {item.views_count}
                              </div>
                            </div>
                            {item.year_created && (
                              <div className="text-xs">
                                {item.year_created}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {/* All Portfolio */}
              {regularPortfolio.length === 0 && featuredPortfolio.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No portfolio items yet</p>
                  {isOwnProfile && (
                    <Button className="mt-4" onClick={() => setShowAddPortfolioDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Portfolio Item
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPortfolio.map((item) => (
                    <Card
                      key={item.id}
                      className="shadow-card hover:shadow-card-hover transition-smooth overflow-hidden group"
                      onClick={() => handleViewPortfolio(item)}
                    >
                      <div className="aspect-square overflow-hidden relative">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <span className="text-muted-foreground">No preview</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-background/90"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-foreground text-sm line-clamp-1">
                            {item.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className="text-xs ml-2 shrink-0"
                          >
                            {getPortfolioCategoryLabel(item.category)}
                          </Badge>
                        </div>

                        <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-3">
                            <button 
                              className="flex items-center hover:text-red-500 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLikePortfolio(item.id);
                              }}
                            >
                              <Heart className={`h-3 w-3 mr-1 ${portfolioLikes.includes(item.id) ? "fill-red-500 text-red-500" : ""}`} />
                              {item.likes_count}
                            </button>
                            <div className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {item.views_count}
                            </div>
                          </div>
                          {item.year_created && (
                            <div className="text-xs">
                              {item.year_created}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {profile!.portfolio_items.length > 0 && (
                <div className="text-center mt-8">
                  <Button variant="outline" size="lg">
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Load More Artwork
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Portfolio Item Modal */}
      <Dialog open={showPortfolioModal} onOpenChange={setShowPortfolioModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPortfolio && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPortfolio.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {selectedPortfolio.image && (
                  <div className="aspect-video overflow-hidden rounded-lg">
                    <img
                      src={selectedPortfolio.image}
                      alt={selectedPortfolio.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Description</h3>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {selectedPortfolio.description}
                      </p>
                    </div>
                    
                    {selectedPortfolio.tags && selectedPortfolio.tags.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedPortfolio.tags.map((tag: any) => (
                            <Badge key={tag.id} variant="secondary">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Category</span>
                          <span className="font-medium">
                            {getPortfolioCategoryLabel(selectedPortfolio.category)}
                          </span>
                        </div>
                        {selectedPortfolio.year_created && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Year</span>
                            <span className="font-medium">{selectedPortfolio.year_created}</span>
                          </div>
                        )}
                        {selectedPortfolio.client && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Client</span>
                            <span className="font-medium">{selectedPortfolio.client}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Likes</span>
                          <span className="font-medium">{selectedPortfolio.likes_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Views</span>
                          <span className="font-medium">{selectedPortfolio.views_count}</span>
                        </div>
                        {selectedPortfolio.project_url && (
                          <div className="pt-2">
                            <Button variant="outline" size="sm" className="w-full" asChild>
                              <a href={selectedPortfolio.project_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-2" />
                                View Project
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleLikePortfolio(selectedPortfolio.id)}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${portfolioLikes.includes(selectedPortfolio.id) ? "fill-red-500 text-red-500" : ""}`} />
                        {portfolioLikes.includes(selectedPortfolio.id) ? 'Liked' : 'Like'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Commission Request Dialog */}
      <Dialog open={showCommissionDialog} onOpenChange={setShowCommissionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Request Commission from {profile!.user.first_name} {profile!.user.last_name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={commissionData.title}
                onChange={(e) => setCommissionData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Character Design for Game"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={commissionData.category}
                onValueChange={(value) => setCommissionData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {getPortfolioCategories().map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                value={commissionData.description}
                onChange={(e) => setCommissionData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project in detail..."
                className="min-h-32"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Budget *</Label>
                <Input
                  id="budget"
                  type="number"
                  value={commissionData.budget}
                  onChange={(e) => setCommissionData(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="$500"
                  required
                  step="0.01"
                />
              </div>
              
              <div>
                <Label htmlFor="deadline">Deadline (Optional)</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={commissionData.deadline}
                  onChange={(e) => setCommissionData(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="reference_images">Reference Images/Details (Optional)</Label>
              <Textarea
                id="reference_images"
                value={commissionData.reference_images}
                onChange={(e) => setCommissionData(prev => ({ ...prev, reference_images: e.target.value }))}
                placeholder="Links to reference images or additional details..."
                className="min-h-24"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommissionDialog(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button 
              className="bg-gradient-primary hover:opacity-90" 
              onClick={handleSubmitCommission}
              disabled={submitting || !commissionData.title || !commissionData.description || !commissionData.category || !commissionData.budget}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Request'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Portfolio Item Dialog - UPDATED with video_file field */}
      <Dialog open={showAddPortfolioDialog} onOpenChange={setShowAddPortfolioDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Portfolio Item</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={newPortfolioItem.title}
                onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Character Design for Fantasy Game"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newPortfolioItem.description}
                onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project..."
                className="min-h-32"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={newPortfolioItem.category}
                onValueChange={(value) => setNewPortfolioItem(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {getPortfolioCategories().map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setNewPortfolioItem(prev => ({ ...prev, image: e.target.files![0] }));
                  }
                }}
              />
            </div>

            {/* ADDED: Video file input */}
            <div>
              <Label htmlFor="video_file">Video File (Optional)</Label>
              <Input
                id="video_file"
                type="file"
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setNewPortfolioItem(prev => ({ ...prev, video_file: e.target.files![0] }));
                  }
                }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year_created">Year Created</Label>
                <Input
                  id="year_created"
                  type="number"
                  value={newPortfolioItem.year_created}
                  onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, year_created: e.target.value }))}
                  placeholder="2024"
                />
              </div>
              
              <div>
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={newPortfolioItem.client}
                  onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, client: e.target.value }))}
                  placeholder="Client name"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="project_url">Project URL</Label>
              <Input
                id="project_url"
                type="url"
                value={newPortfolioItem.project_url}
                onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, project_url: e.target.value }))}
                placeholder="https://example.com/project"
              />
            </div>
            
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={newPortfolioItem.tags.join(', ')}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                  setNewPortfolioItem(prev => ({ ...prev, tags }));
                }}
                placeholder="fantasy, character, digital painting"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={newPortfolioItem.is_featured}
                onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, is_featured: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="is_featured">
                Mark as featured work
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPortfolioDialog(false)} disabled={addingPortfolio}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddPortfolioItem}
              disabled={addingPortfolio || !newPortfolioItem.title || !newPortfolioItem.description || !newPortfolioItem.category}
            >
              {addingPortfolio ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add to Portfolio'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtistProfile;
