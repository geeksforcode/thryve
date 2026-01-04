import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin, Eye, Heart, Users, Star, Loader2, ExternalLink,
  Palette, Briefcase, Calendar, Mail, Globe, Instagram, Twitter,
  Award, Image as ImageIcon, Video, Music, FileText, Download,
  Share2, Bookmark, MessageCircle, Filter, Grid, List, X,
  ChevronLeft, ChevronRight, Maximize2, Play, CheckCircle
} from "lucide-react"
import Navigation from "@/components/Navigation"
import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { 
  getArtistDetail,
  likeArtist,
  followArtist,
  likePortfolioItem,
  requestCommission
} from "@/services/apiClient"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ContactModal from "@/components/modals/ContactModal"

interface Artist {
  id: number;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture?: string;
    date_joined: string;
  };
  bio: string;
  category: string;
  specialty: string;
  location: string;
  rating: number;
  followers_count: number;
  total_likes: number;
  total_views: number;
  is_available: boolean;
  website?: string;
  instagram?: string;
  twitter?: string;
  skills: Array<{
    id: number;
    name: string;
    level: string;
    years_experience: number;
  }>;
  experiences: Array<{
    id: number;
    title: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string;
    description: string;
    is_current: boolean;
  }>;
  portfolio_items: Array<{
    id: number;
    title: string;
    description: string;
    category: string;
    tags: string[];
    image: string | null;
    video_url: string | null;
    video_file: string | null;
    likes_count: number;
    views_count: number;
    created_at: string;
    media_type: 'image' | 'video' | 'audio' | 'document';
    file_size?: string;
    is_featured: boolean;
  }>;
  featured_portfolio: Array<{
    id: number;
    title: string;
    description: string;
    category: string;
    image: string | null;
    likes_count: number;
    views_count: number;
  }>;
  stats?: {
    total_projects: number;
    completed_projects: number;
    avg_rating: number;
    response_rate: number;
    avg_response_time: string;
  };
}

const ViewPortfolio = () => {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const { user: authUser, isAuthenticated } = useAuth()
  
  const [artist, setArtist] = useState<Artist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)
  const [following, setFollowing] = useState(false)
  const [likedItems, setLikedItems] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("portfolio")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [imageZoom, setImageZoom] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadArtist = async () => {
      if (!username) {
        navigate('/listings/artists')
        return
      }
      
      try {
        setLoading(true)
        setError(null)
        
        const artistData = await getArtistDetail(username)
        setArtist(artistData)
        
        // Check if user has liked or followed this artist
        // You might want to add API endpoints for this
        // For now, we'll rely on local state
        
      } catch (err: any) {
        console.error('Failed to load artist:', err)
        setError(err.message || 'Failed to load artist portfolio')
        setArtist(null)
      } finally {
        setLoading(false)
      }
    }
    
    loadArtist()
  }, [username, navigate])

  const handleLikeArtist = async () => {
    if (!artist || !isAuthenticated) {
      navigate(`/auth?role=investor&returnUrl=/artist/${username}`)
      return
    }
    
    try {
      setLiked(!liked)
      await likeArtist(artist.id)
      
      toast({
        title: liked ? "Unliked" : "Liked",
        description: liked ? "Removed from your likes" : "Added to your likes",
        variant: "default",
      })
      
      // Update local state
      if (artist) {
        setArtist({
          ...artist,
          total_likes: liked ? artist.total_likes - 1 : artist.total_likes + 1
        })
      }
      
    } catch (err: any) {
      console.error('Failed to like artist:', err)
      setLiked(!liked) // Revert on error
      toast({
        title: "Error",
        description: err.message || 'Failed to like artist',
        variant: "destructive",
      })
    }
  }

  const handleFollowArtist = async () => {
    if (!artist || !isAuthenticated) {
      navigate(`/auth?role=investor&returnUrl=/artist/${username}`)
      return
    }
    
    try {
      setFollowing(!following)
      await followArtist(artist.id)
      
      toast({
        title: following ? "Unfollowed" : "Following",
        description: following ? "You are no longer following this artist" : "You are now following this artist",
        variant: "default",
      })
      
      // Update local state
      if (artist) {
        setArtist({
          ...artist,
          followers_count: following ? artist.followers_count - 1 : artist.followers_count + 1
        })
      }
      
    } catch (err: any) {
      console.error('Failed to follow artist:', err)
      setFollowing(!following) // Revert on error
      toast({
        title: "Error",
        description: err.message || 'Failed to follow artist',
        variant: "destructive",
      })
    }
  }

  const handleLikePortfolioItem = async (itemId: number) => {
    if (!isAuthenticated) {
      navigate(`/auth?role=investor&returnUrl=/artist/${username}`)
      return
    }
    
    try {
      const isCurrentlyLiked = likedItems.includes(itemId)
      await likePortfolioItem(itemId)
      
      if (isCurrentlyLiked) {
        setLikedItems(prev => prev.filter(id => id !== itemId))
      } else {
        setLikedItems(prev => [...prev, itemId])
      }
      
      // Update portfolio item likes count
      if (artist) {
        setArtist({
          ...artist,
          portfolio_items: artist.portfolio_items.map(item => 
            item.id === itemId 
              ? { ...item, likes_count: isCurrentlyLiked ? item.likes_count - 1 : item.likes_count + 1 }
              : item
          )
        })
      }
      
    } catch (err: any) {
      console.error('Failed to like portfolio item:', err)
      toast({
        title: "Error",
        description: err.message || 'Failed to like item',
        variant: "destructive",
      })
    }
  }

  const handleSaveArtist = async () => {
    if (!artist || !isAuthenticated) {
      navigate(`/auth?role=investor&returnUrl=/artist/${username}`)
      return
    }
    
    try {
      setSaving(true)
      // You'll need to implement saveArtist API endpoint
      // await saveArtist(artist.id)
      
      toast({
        title: "Saved",
        description: "Artist saved to your favorites",
        variant: "default",
      })
      
    } catch (err: any) {
      console.error('Failed to save artist:', err)
      toast({
        title: "Error",
        description: err.message || 'Failed to save artist',
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short'
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'video': return Video
      case 'audio': return Music
      case 'document': return FileText
      default: return ImageIcon
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'digital_art': 'bg-purple-100 text-purple-800',
      'illustration': 'bg-pink-100 text-pink-800',
      'graphic_design': 'bg-blue-100 text-blue-800',
      'photography': 'bg-green-100 text-green-800',
      'animation': 'bg-orange-100 text-orange-800',
      '3d_modeling': 'bg-indigo-100 text-indigo-800',
      'ui_ux': 'bg-cyan-100 text-cyan-800',
      'default': 'bg-gray-100 text-gray-800'
    }
    return colors[category] || colors.default
  }

  const getSkillLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-orange-100 text-orange-800',
      'expert': 'bg-red-100 text-red-800'
    }
    return colors[level] || colors.beginner
  }

  // Get all unique categories from portfolio items
  const categories = artist 
    ? ['all', ...new Set(artist.portfolio_items.map(item => item.category))]
    : []

  // Filter portfolio items by selected category
  const filteredPortfolioItems = artist 
    ? selectedCategory === 'all' 
      ? artist.portfolio_items 
      : artist.portfolio_items.filter(item => item.category === selectedCategory)
    : []

  // Navigation for image viewer
  const navigateImage = (direction: 'prev' | 'next') => {
    if (!artist || selectedImage === null) return
    
    const currentIndex = artist.portfolio_items.findIndex(item => item.id === selectedImage)
    if (currentIndex === -1) return
    
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % artist.portfolio_items.length
      : (currentIndex - 1 + artist.portfolio_items.length) % artist.portfolio_items.length
    
    setSelectedImage(artist.portfolio_items[newIndex].id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex flex-col justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">
            Loading artist portfolio...
          </p>
        </div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Artist not found
          </h1>
          <p className="text-muted-foreground mt-2">
            The artist portfolio could not be found.
          </p>
          {error && (
            <Alert variant="destructive" className="mt-4 max-w-md mx-auto">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="mt-4">
            <Button asChild>
              <Link to="/listings/artists">Back to Artists</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Button */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <Link to="/listings/artists">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Artists
              </Link>
            </Button>
          </div>

          {/* Artist Header */}
          <Card className="shadow-card mb-8">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 lg:w-32 lg:h-32 mx-auto sm:mx-0 border-4 border-background shadow-lg">
                      <AvatarImage 
                        src={artist.user.profile_picture} 
                        alt={`${artist.user.first_name} ${artist.user.last_name}`} 
                      />
                      <AvatarFallback className="text-xl lg:text-2xl">
                        {getInitials(artist.user.first_name, artist.user.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    {artist.rating > 0 && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 shadow-sm">
                          <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                          {artist.rating.toFixed(1)}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center sm:text-left space-y-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
                        {artist.user.first_name} {artist.user.last_name}
                      </h1>
                      <p className="text-lg lg:text-xl text-primary font-medium mb-1">
                        {artist.specialty}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-muted-foreground text-sm lg:text-base">
                        <div className="flex items-center justify-center sm:justify-start">
                          <MapPin className="h-4 w-4 mr-2" />
                          {artist.location}
                        </div>
                        <div className="flex items-center justify-center sm:justify-start">
                          <Palette className="h-4 w-4 mr-2" />
                          <Badge variant="secondary">
                            {artist.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start">
                          <Calendar className="h-4 w-4 mr-2" />
                          Member since {formatDate(artist.user.date_joined)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 lg:gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-foreground">
                          {formatNumber(artist.total_views)}
                        </div>
                        <div className="text-muted-foreground">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">
                          {formatNumber(artist.total_likes)}
                        </div>
                        <div className="text-muted-foreground">Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">
                          {formatNumber(artist.followers_count)}
                        </div>
                        <div className="text-muted-foreground">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">
                          {artist.is_available ? "Available" : "Unavailable"}
                        </div>
                        <div className="text-muted-foreground">Status</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button 
                    variant={following ? "default" : "outline"}
                    size="sm"
                    onClick={handleFollowArtist}
                    disabled={!artist.is_available}
                  >
                    <Users className={`h-4 w-4 mr-2 ${following ? "fill-current" : ""}`} />
                    {following ? 'Following' : 'Follow'}
                  </Button>
                  
                  <Button 
                    variant={liked ? "default" : "outline"}
                    size="sm"
                    onClick={handleLikeArtist}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                    {liked ? 'Liked' : 'Like'}
                  </Button>
                  
                  {artist.is_available && isAuthenticated && authUser?.role === 'investor' && (
                    <ContactModal 
                      recipientName={`${artist.user.first_name} ${artist.user.last_name}`}
                      recipientType="artist"
                      triggerText="Request Commission"
                      triggerVariant="default"
                      artistId={artist.id}
                    />
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSaveArtist}
                    disabled={saving}
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Portfolio */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tabs */}
              <Tabs defaultValue="portfolio" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between mb-6">
                  <TabsList>
                    <TabsTrigger value="portfolio">
                      Portfolio ({artist.portfolio_items.length})
                    </TabsTrigger>
                    <TabsTrigger value="about">
                      About
                    </TabsTrigger>
                    <TabsTrigger value="experience">
                      Experience
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* View Mode Toggle for Portfolio */}
                  {activeTab === "portfolio" && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Portfolio Tab */}
                <TabsContent value="portfolio" className="space-y-6">
                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category === 'all' ? 'All Work' : category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Button>
                    ))}
                  </div>

                  {/* Portfolio Grid/List */}
                  {filteredPortfolioItems.length === 0 ? (
                    <Card className="text-center py-12">
                      <CardContent>
                        <Palette className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          No portfolio items found
                        </h3>
                        <p className="text-muted-foreground">
                          {selectedCategory === 'all' 
                            ? "This artist hasn't uploaded any work yet."
                            : "No items found in this category."}
                        </p>
                      </CardContent>
                    </Card>
                  ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredPortfolioItems.map((item) => {
                        const MediaIcon = getMediaIcon(item.media_type)
                        return (
                          <Card 
                            key={item.id} 
                            className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                            onClick={() => setSelectedImage(item.id)}
                          >
                            <div className="relative aspect-square bg-muted overflow-hidden">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <MediaIcon className="h-12 w-12 text-muted-foreground" />
                                </div>
                              )}
                              
                              {/* Overlay */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                                <Button 
                                  variant="secondary" 
                                  size="icon"
                                  className="bg-white/90 hover:bg-white"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleLikePortfolioItem(item.id)
                                  }}
                                >
                                  <Heart className={`h-4 w-4 ${likedItems.includes(item.id) ? "fill-red-500 text-red-500" : ""}`} />
                                </Button>
                                <Button 
                                  variant="secondary" 
                                  size="icon"
                                  className="bg-white/90 hover:bg-white"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setImageZoom(true)
                                  }}
                                >
                                  <Maximize2 className="h-4 w-4" />
                                </Button>
                                {item.media_type === 'video' && (
                                  <Button 
                                    variant="secondary" 
                                    size="icon"
                                    className="bg-white/90 hover:bg-white"
                                  >
                                    <Play className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              
                              {/* Category Badge */}
                              <div className="absolute top-2 left-2">
                                <Badge className={`${getCategoryColor(item.category)} text-xs`}>
                                  {item.category.replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>
                            
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
                                {item.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {item.description}
                              </p>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center">
                                    <Heart className="h-3 w-3 mr-1" />
                                    {formatNumber(item.likes_count)}
                                  </div>
                                  <div className="flex items-center">
                                    <Eye className="h-3 w-3 mr-1" />
                                    {formatNumber(item.views_count)}
                                  </div>
                                </div>
                                <span className="text-xs">
                                  {getTimeAgo(item.created_at)}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredPortfolioItems.map((item) => {
                        const MediaIcon = getMediaIcon(item.media_type)
                        return (
                          <Card key={item.id} className="hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-4 p-4">
                              <div className="flex-shrink-0 w-24 h-24 rounded-md bg-muted overflow-hidden">
                                {item.image ? (
                                  <img 
                                    src={item.image} 
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <MediaIcon className="h-8 w-8 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-grow">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-foreground">
                                      {item.title}
                                    </h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {item.category.replace('_', ' ')}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {getTimeAgo(item.created_at)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleLikePortfolioItem(item.id)}
                                    >
                                      <Heart className={`h-4 w-4 ${likedItems.includes(item.id) ? "fill-red-500 text-red-500" : ""}`} />
                                      <span className="ml-1 text-xs">{item.likes_count}</span>
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Eye className="h-4 w-4" />
                                      <span className="ml-1 text-xs">{item.views_count}</span>
                                    </Button>
                                  </div>
                                </div>
                                
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                  {item.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {item.tags.slice(0, 3).map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {item.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{item.tags.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  )}

                  {/* Portfolio Stats */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-4">Portfolio Stats</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-primary/5 rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {artist.portfolio_items.length}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Works</div>
                        </div>
                        <div className="text-center p-4 bg-primary/5 rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {artist.portfolio_items.filter(item => item.is_featured).length}
                          </div>
                          <div className="text-sm text-muted-foreground">Featured</div>
                        </div>
                        <div className="text-center p-4 bg-primary/5 rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {categories.length - 1}
                          </div>
                          <div className="text-sm text-muted-foreground">Categories</div>
                        </div>
                        <div className="text-center p-4 bg-primary/5 rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {formatNumber(artist.portfolio_items.reduce((sum, item) => sum + item.likes_count, 0))}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Likes</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* About Tab */}
                <TabsContent value="about" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-foreground">About</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {artist.bio || "No bio available."}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Skills */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-foreground">Skills & Expertise</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {artist.skills.map((skill) => (
                          <div key={skill.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-foreground">{skill.name}</span>
                              <Badge className={`${getSkillLevelColor(skill.level)} text-xs`}>
                                {skill.level}
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span>{skill.years_experience} year{skill.years_experience !== 1 ? 's' : ''} experience</span>
                            </div>
                            <Separator />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Experience Tab */}
                <TabsContent value="experience" className="space-y-6">
                  {artist.experiences.length === 0 ? (
                    <Card className="text-center py-12">
                      <CardContent>
                        <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          No experience listed
                        </h3>
                        <p className="text-muted-foreground">
                          This artist hasn't added any work experience yet.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {artist.experiences.map((exp) => (
                        <Card key={exp.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-foreground">{exp.title}</h3>
                                <p className="text-primary font-medium">{exp.company}</p>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {exp.location}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                </div>
                              </div>
                              {exp.is_current && (
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <Separator className="my-4" />
                            <p className="text-muted-foreground text-sm">
                              {exp.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Contact & Social */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-foreground">Contact</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span className="text-sm">{artist.user.email}</span>
                  </div>
                  
                  {artist.website && (
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 mr-3 text-muted-foreground" />
                      <a 
                        href={artist.website.startsWith('http') ? artist.website : `https://${artist.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                  
                  {artist.instagram && (
                    <div className="flex items-center">
                      <Instagram className="h-5 w-5 mr-3 text-muted-foreground" />
                      <a 
                        href={`https://instagram.com/${artist.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        @{artist.instagram}
                      </a>
                    </div>
                  )}
                  
                  {artist.twitter && (
                    <div className="flex items-center">
                      <Twitter className="h-5 w-5 mr-3 text-muted-foreground" />
                      <a 
                        href={`https://twitter.com/${artist.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        @{artist.twitter}
                      </a>
                    </div>
                  )}
                  
                  {artist.is_available && (
                    <div className="pt-4">
                      <ContactModal 
                        recipientName={`${artist.user.first_name} ${artist.user.last_name}`}
                        recipientType="artist"
                        triggerText="Send Message"
                        triggerVariant="default"
                        triggerClassName="w-full"
                        artistId={artist.id}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Availability Status */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-foreground">Availability</h3>
                </CardHeader>
                <CardContent>
                  <div className={`flex items-center justify-center p-4 rounded-lg ${artist.is_available ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${artist.is_available ? 'bg-green-100' : 'bg-gray-100'} mb-2`}>
                        {artist.is_available ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <X className="h-6 w-6 text-gray-600" />
                        )}
                      </div>
                      <div className={`font-semibold ${artist.is_available ? 'text-green-700' : 'text-gray-700'}`}>
                        {artist.is_available ? 'Available for Work' : 'Currently Unavailable'}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {artist.is_available 
                          ? 'Open to commission requests and collaborations'
                          : 'Not accepting new projects at the moment'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              {artist.stats && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-foreground">Performance</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Projects Completed</span>
                      <span className="font-semibold">{artist.stats.completed_projects}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Average Rating</span>
                      <span className="font-semibold">{artist.stats.avg_rating.toFixed(1)}/5.0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Response Rate</span>
                      <span className="font-semibold">{artist.stats.response_rate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Avg Response Time</span>
                      <span className="font-semibold">{artist.stats.avg_response_time}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Share */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-foreground">Share Portfolio</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Invite
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Image Viewer Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            
            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 text-white hover:bg-white/20"
              onClick={() => navigateImage('prev')}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 text-white hover:bg-white/20"
              onClick={() => navigateImage('next')}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
            
            {/* Image */}
            {artist && (
              <div className="max-w-4xl max-h-[80vh] p-4">
                <img 
                  src={artist.portfolio_items.find(item => item.id === selectedImage)?.image || ''}
                  alt="Portfolio item"
                  className="w-full h-full object-contain max-h-[70vh]"
                />
                
                {/* Image info */}
                <div className="mt-4 text-white text-center">
                  <h3 className="text-xl font-semibold">
                    {artist.portfolio_items.find(item => item.id === selectedImage)?.title}
                  </h3>
                  <p className="text-gray-300 mt-2">
                    {artist.portfolio_items.find(item => item.id === selectedImage)?.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewPortfolio
