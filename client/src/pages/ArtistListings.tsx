import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Eye, Heart, Users, Star, Loader2, ExternalLink } from "lucide-react"
import SearchBar from "@/components/SearchBar"
import Navigation from "@/components/Navigation"
import { useState, useEffect } from "react"
import { getArtists, getArtistFilters, likeArtist, followArtist } from "@/services/apiClient"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

interface Artist {
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
  rating: number;
  followers_count: number;
  total_likes: number;
  total_views: number;
  is_available: boolean;
  skills: Array<{
    id: number;
    name: string;
    level: string;
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
}

interface FiltersData {
  categories: Record<string, string>;
  popular_skills: Array<{name: string; count: number}>;
  locations: string[];
  portfolio_categories: Record<string, string>;
}

const ArtistListings = () => {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [filters, setFilters] = useState<FiltersData | null>(null)
  const [searchParams, setSearchParams] = useState({
    search: '',
    category: '',
    skills: [] as string[],
    location: '',
    available: '',
    ordering: '-rating'
  })
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [likedArtists, setLikedArtists] = useState<number[]>([])
  const [followingArtists, setFollowingArtists] = useState<number[]>([])
  const { user, isAuthenticated } = useAuth()

  // Load artists and filters
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [artistsData, filtersData] = await Promise.all([
          getArtists(searchParams),
          getArtistFilters()
        ])
        
        setArtists(artistsData.results || artistsData)
        setFilters(filtersData)
        
        // Check if there are more pages
        if (artistsData.next) {
          setHasMore(true)
        } else {
          setHasMore(false)
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [searchParams])

  const handleSearch = (query: string, filterValues: any) => {
    setSearchParams(prev => ({
      ...prev,
      search: query,
      category: filterValues.category || '',
      skills: filterValues.skills ? [filterValues.skills] : [],
      location: filterValues.location || '',
      available: filterValues.available || '',
      ordering: filterValues.ordering || '-rating'
    }))
    setPage(1)
  }

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true)
      const nextPage = page + 1
      const response = await getArtists({
        ...searchParams,
        page: nextPage
      })
      
      if (response.results) {
        setArtists(prev => [...prev, ...response.results])
        setPage(nextPage)
        setHasMore(!!response.next)
      }
    } catch (error) {
      console.error('Failed to load more artists:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  const handleLikeArtist = async (artistId: number) => {
    if (!isAuthenticated) {
      window.location.href = '/auth?redirect=' + encodeURIComponent('/listings/artists')
      return
    }
    
    try {
      await likeArtist(artistId)
      if (likedArtists.includes(artistId)) {
        setLikedArtists(prev => prev.filter(id => id !== artistId))
        // Update likes count
        setArtists(prev => prev.map(artist => 
          artist.id === artistId 
            ? { ...artist, total_likes: artist.total_likes - 1 }
            : artist
        ))
      } else {
        setLikedArtists(prev => [...prev, artistId])
        // Update likes count
        setArtists(prev => prev.map(artist => 
          artist.id === artistId 
            ? { ...artist, total_likes: artist.total_likes + 1 }
            : artist
        ))
      }
    } catch (error) {
      console.error('Failed to like artist:', error)
    }
  }

  const handleFollowArtist = async (artistId: number) => {
    if (!isAuthenticated) {
      window.location.href = '/auth?redirect=' + encodeURIComponent('/listings/artists')
      return
    }
    
    try {
      await followArtist(artistId)
      if (followingArtists.includes(artistId)) {
        setFollowingArtists(prev => prev.filter(id => id !== artistId))
        // Update followers count
        setArtists(prev => prev.map(artist => 
          artist.id === artistId 
            ? { ...artist, followers_count: artist.followers_count - 1 }
            : artist
        ))
      } else {
        setFollowingArtists(prev => [...prev, artistId])
        // Update followers count
        setArtists(prev => prev.map(artist => 
          artist.id === artistId 
            ? { ...artist, followers_count: artist.followers_count + 1 }
            : artist
        ))
      }
    } catch (error) {
      console.error('Failed to follow artist:', error)
    }
  }

  const getCategoryLabel = (category: string) => {
    if (!filters?.categories) return category
    return filters.categories[category] || category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
              Artist Portfolios
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore creative talent and find the perfect artist for your project
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar 
              placeholder="Search for artists by name, specialty, or style..."
              showSkillsFilter={true}
              showLocationFilter={true}
              showCategoryFilter={true}
              showAvailableFilter={true}
              onSearch={handleSearch}
            />
          </div>

          {/* Active Filters */}
          {(searchParams.search || searchParams.category || searchParams.location || searchParams.available) && (
            <div className="mb-6 flex flex-wrap gap-2">
              {searchParams.search && (
                <Badge variant="secondary" className="px-3 py-1">
                  Search: {searchParams.search}
                  <button 
                    onClick={() => setSearchParams(prev => ({ ...prev, search: '' }))}
                    className="ml-2 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {searchParams.category && (
                <Badge variant="secondary" className="px-3 py-1">
                  Category: {getCategoryLabel(searchParams.category)}
                  <button 
                    onClick={() => setSearchParams(prev => ({ ...prev, category: '' }))}
                    className="ml-2 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {searchParams.location && (
                <Badge variant="secondary" className="px-3 py-1">
                  Location: {searchParams.location}
                  <button 
                    onClick={() => setSearchParams(prev => ({ ...prev, location: '' }))}
                    className="ml-2 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {searchParams.available === 'true' && (
                <Badge variant="secondary" className="px-3 py-1">
                  Available Only
                  <button 
                    onClick={() => setSearchParams(prev => ({ ...prev, available: '' }))}
                    className="ml-2 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Artist Cards */}
          {artists.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                No artists found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSearchParams({
                  search: '',
                  category: '',
                  skills: [],
                  location: '',
                  available: '',
                  ordering: '-rating'
                })}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artists.map((artist) => (
                  <Card key={artist.id} className="shadow-card hover:shadow-card-hover transition-smooth overflow-hidden flex flex-col">
                    <CardHeader className="text-center pb-4">
                      <div className="relative">
                        <Avatar className="w-20 h-20 mx-auto mb-4">
                          <AvatarImage src={artist.user.profile_picture} alt={`${artist.user.first_name} ${artist.user.last_name}`} />
                          <AvatarFallback>
                            {getInitials(artist.user.first_name, artist.user.last_name)}
                          </AvatarFallback>
                        </Avatar>
                        
                        {artist.rating > 0 && (
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                              {artist.rating.toFixed(1)}
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-heading font-semibold text-lg text-foreground">
                        {artist.user.first_name} {artist.user.last_name}
                      </h3>
                      <p className="text-primary font-medium text-sm line-clamp-1">
                        {artist.specialty}
                      </p>
                      
                      <div className="flex items-center justify-center text-sm text-muted-foreground mt-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {artist.location}
                      </div>
                    </CardHeader>

                    {/* Portfolio Preview */}
                    {artist.featured_portfolio && artist.featured_portfolio.length > 0 && (
                      <div className="px-6 mb-4">
                        <div className="grid grid-cols-3 gap-2">
                          {artist.featured_portfolio.slice(0, 3).map((item, index) => (
                            <div 
                              key={item.id} 
                              className="aspect-square bg-muted rounded-md overflow-hidden relative group"
                            >
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                  <span className="text-xs text-muted-foreground">Art</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground text-sm mb-4 text-center line-clamp-2">
                        {artist.bio}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {artist.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill.id} variant="secondary" className="text-xs">
                            {skill.name}
                          </Badge>
                        ))}
                        {artist.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{artist.skills.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {formatNumber(artist.total_likes)}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {formatNumber(artist.total_views)}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {formatNumber(artist.followers_count)}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-4">
                      <div className="w-full space-y-2">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1"
                            onClick={() => handleLikeArtist(artist.id)}
                          >
                            <Heart className={`h-4 w-4 mr-2 ${likedArtists.includes(artist.id) ? "fill-red-500 text-red-500" : ""}`} />
                            {likedArtists.includes(artist.id) ? 'Liked' : 'Like'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1"
                            onClick={() => handleFollowArtist(artist.id)}
                          >
                            <Users className={`h-4 w-4 mr-2 ${followingArtists.includes(artist.id) ? "text-primary" : ""}`} />
                            {followingArtists.includes(artist.id) ? 'Following' : 'Follow'}
                          </Button>
                        </div>
                        <Button 
                          asChild 
                          className="w-full bg-gradient-primary hover:opacity-90"
                        >
                          <Link to={`/artist/${artist.user.username}`}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Portfolio
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center mt-12">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More Artists'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Stats */}
          {artists.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
              <p>Showing {artists.length} artist{artists.length !== 1 ? 's' : ''} • Updated just now</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ArtistListings
