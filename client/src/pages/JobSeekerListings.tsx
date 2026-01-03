import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Briefcase, Star, Loader2 } from "lucide-react"
import SearchBar from "@/components/SearchBar"
import Navigation from "@/components/Navigation"
import { useState, useEffect } from "react"
import { getJobSeekerListings, getJobSeekerFilters } from "@/services/apiClient"
import { Link } from "react-router-dom"

interface JobSeeker {
  id: number;
  user: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  title: string;
  location: string;
  experience_level: string;
  bio: string;
  rating: number;
  avatar?: string;
  skills: Array<{
    id: number;
    name: string;
  }>;
  completed_projects?: number;
}

interface FiltersData {
  experience_levels: Record<string, string>;
  popular_skills: Array<{name: string; count: number}>;
  locations: string[];
}

const JobSeekerListings = () => {
  const [jobSeekers, setJobSeekers] = useState<JobSeeker[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [filters, setFilters] = useState<FiltersData | null>(null)
  const [searchParams, setSearchParams] = useState({
    search: '',
    experience_level: '',
    skills: [] as string[],
    location: '',
    ordering: '-rating'
  })
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Load job seekers and filters
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [listingsData, filtersData] = await Promise.all([
          getJobSeekerListings(searchParams),
          getJobSeekerFilters()
        ])
        
        setJobSeekers(listingsData.results || listingsData)
        setFilters(filtersData)
        
        // Check if there are more pages
        if (listingsData.next) {
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
      experience_level: filterValues.experience || '',
      skills: filterValues.skills ? [filterValues.skills] : [],
      location: filterValues.location || '',
      jobType: filterValues.jobType || ''
    }))
    setPage(1) // Reset to first page on new search
  }

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true)
      const nextPage = page + 1
      const response = await getJobSeekerListings({
        ...searchParams,
        page: nextPage
      })
      
      if (response.results) {
        setJobSeekers(prev => [...prev, ...response.results])
        setPage(nextPage)
        setHasMore(!!response.next)
      }
    } catch (error) {
      console.error('Failed to load more:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  const getExperienceLevelLabel = (level: string) => {
    if (!filters?.experience_levels) return level
    return filters.experience_levels[level] || level
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
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
              Job Seeker Profiles
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover talented professionals ready to join your team
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar 
              placeholder="Search for job seekers by name, skills, or experience..."
              showSkillsFilter={true}
              showJobTypeFilter={true}
              onSearch={handleSearch}
            />
          </div>

          {/* Filters Summary */}
          {(searchParams.search || searchParams.experience_level || searchParams.skills.length > 0 || searchParams.location) && (
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
              {searchParams.experience_level && (
                <Badge variant="secondary" className="px-3 py-1">
                  Experience: {getExperienceLevelLabel(searchParams.experience_level)}
                  <button 
                    onClick={() => setSearchParams(prev => ({ ...prev, experience_level: '' }))}
                    className="ml-2 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {searchParams.skills.map(skill => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  Skill: {skill}
                  <button 
                    onClick={() => setSearchParams(prev => ({ 
                      ...prev, 
                      skills: prev.skills.filter(s => s !== skill) 
                    }))}
                    className="ml-2 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              ))}
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
            </div>
          )}

          {/* Job Seeker Cards */}
          {jobSeekers.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                No job seekers found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobSeekers.map((seeker) => (
                  <Card key={seeker.id} className="shadow-card hover:shadow-card-hover transition-smooth h-full flex flex-col">
                    <CardHeader className="text-center">
                      <Avatar className="w-20 h-20 mx-auto mb-4">
                        <AvatarImage 
                          src={seeker.avatar || `/api/placeholder/80/80`} 
                          alt={`${seeker.user.first_name} ${seeker.user.last_name}`} 
                        />
                        <AvatarFallback>
                          {getInitials(seeker.user.first_name, seeker.user.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <h3 className="font-heading font-semibold text-lg text-foreground">
                        {seeker.user.first_name} {seeker.user.last_name}
                      </h3>
                      <p className="text-primary font-medium">{seeker.title}</p>
                      
                      <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{seeker.location || 'Location not specified'}</span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>{getExperienceLevelLabel(seeker.experience_level)}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                          <span>{seeker.rating?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground text-sm mb-4 text-center line-clamp-3">
                        {seeker.bio || 'No bio provided'}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 justify-center">
                        {seeker.skills.slice(0, 5).map((skill) => (
                          <Badge key={skill.id} variant="secondary" className="text-xs">
                            {skill.name}
                          </Badge>
                        ))}
                        {seeker.skills.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{seeker.skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="mt-auto">
                      <Button asChild className="w-full bg-gradient-primary hover:opacity-90">
                        <Link to={`/job-seekers/${seeker.user.username}`}>
                          View Profile
                        </Link>
                      </Button>
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
                      'Load More Profiles'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default JobSeekerListings
