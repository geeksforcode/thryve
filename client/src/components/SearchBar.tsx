import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { 
  getJobSeekerFilters,
  getArtistFilters,
} from "@/services/apiClient"

interface SearchBarProps {
  placeholder?: string
  showRoleFilter?: boolean
  showLocationFilter?: boolean
  showSkillsFilter?: boolean
  showInvestmentFilter?: boolean
  showJobTypeFilter?: boolean
  showExperienceFilter?: boolean
  showRemoteFilter?: boolean
  showCategoryFilter?: boolean
  showAvailableFilter?: boolean
  filterType?: 'job_seeker' | 'job' | 'artist' | 'investor' | 'general'
  onSearch?: (query: string, filters: any) => void
}

const SearchBar = ({ 
  placeholder = "Search...", 
  showRoleFilter = false,
  showLocationFilter = true,
  showSkillsFilter = true,
  showInvestmentFilter = false,
  showJobTypeFilter = true,
  showExperienceFilter = true,
  showRemoteFilter = false,
  showCategoryFilter = false,
  showAvailableFilter = false,
  filterType = 'general',
  onSearch 
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    // General filters
    experience: "all_experience",
    location: "all_locations",
    skills: "all_skills",
    investmentRange: "all_investment",
    jobType: "all_job_types",
    remote: "all_remote",
    category: "all_categories",
    available: "all_availability",
    ordering: "-rating"
  })
  
  const [availableFilters, setAvailableFilters] = useState<{
    experience_levels?: Record<string, string>;
    popular_skills?: Array<{name: string; count: number}>;
    locations?: string[];
    categories?: Record<string, string>;
    portfolio_categories?: Record<string, string>;
    job_types?: Record<string, string>;
  }>({})

  // Load available filters from API based on filter type
  useEffect(() => {
    const loadFilters = async () => {
      try {
        let data;
        switch(filterType) {
          case 'job_seeker':
            data = await getJobSeekerFilters();
            break;
          case 'artist':
            data = await getArtistFilters();
            break;
          default:
            data = {};
        }
        setAvailableFilters(data);
      } catch (error) {
        console.error('Failed to load filters:', error);
      }
    }
    
    if (filterType !== 'general') {
      loadFilters();
    }
  }, [filterType])

  const handleSearch = () => {
    // Convert "all_" values back to empty strings for API
    const apiFilters = {
      experience: filters.experience === "all_experience" ? "" : filters.experience,
      location: filters.location === "all_locations" ? "" : filters.location,
      skills: filters.skills === "all_skills" ? "" : filters.skills,
      investmentRange: filters.investmentRange === "all_investment" ? "" : filters.investmentRange,
      jobType: filters.jobType === "all_job_types" ? "" : filters.jobType,
      remote: filters.remote === "all_remote" ? "" : filters.remote,
      category: filters.category === "all_categories" ? "" : filters.category,
      available: filters.available === "all_availability" ? "" : filters.available,
      ordering: filters.ordering
    }
    onSearch?.(searchQuery, apiFilters)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      experience: "all_experience",
      location: "all_locations",
      skills: "all_skills",
      investmentRange: "all_investment",
      jobType: "all_job_types",
      remote: "all_remote",
      category: "all_categories",
      available: "all_availability",
      ordering: "-rating"
    })
    setSearchQuery("")
    // Trigger search with empty filters
    onSearch?.("", {
      experience: "",
      location: "",
      skills: "",
      investmentRange: "",
      jobType: "",
      remote: "",
      category: "",
      available: "",
      ordering: "-rating"
    })
  }

  // Remove individual filter
  const removeFilter = (filterKey: string) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: filterKey === 'experience' ? 'all_experience' :
                   filterKey === 'location' ? 'all_locations' :
                   filterKey === 'skills' ? 'all_skills' :
                   filterKey === 'jobType' ? 'all_job_types' :
                   filterKey === 'remote' ? 'all_remote' :
                   filterKey === 'category' ? 'all_categories' :
                   filterKey === 'available' ? 'all_availability' : prev[filterKey]
    }))
  }

  // Get filter label for display
  const getFilterLabel = (key: string, value: string) => {
    if (value.startsWith('all_')) return '';
    
    switch(key) {
      case 'experience':
        return availableFilters.experience_levels?.[value] || value;
      case 'category':
        const categories = availableFilters.categories || availableFilters.portfolio_categories;
        return categories?.[value] || value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      case 'jobType':
        const jobTypes = availableFilters.job_types || {
          'full_time': 'Full Time',
          'part_time': 'Part Time',
          'contract': 'Contract',
          'freelance': 'Freelance',
          'internship': 'Internship',
          'temporary': 'Temporary'
        };
        return jobTypes[value] || value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      case 'remote':
        return value === 'true' ? 'Remote Only' : 
               value === 'false' ? 'On-site Only' : 
               value === 'hybrid' ? 'Hybrid' : value;
      case 'available':
        return value === 'true' ? 'Available Only' : 'Not Available';
      case 'skills':
        return value;
      case 'location':
        return value;
      default:
        return value;
    }
  }

  // Check if any filters are active (excluding "all_" values)
  const hasActiveFilters = () => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'ordering') return false;
      return !value.startsWith('all_');
    })
  }

  // Get active filters for display
  const getActiveFilters = () => {
    return Object.entries(filters)
      .filter(([key, value]) => {
        if (key === 'ordering') return false;
        return !value.startsWith('all_') && value !== '';
      })
      .map(([key, value]) => ({
        key,
        value,
        label: getFilterLabel(key, value)
      }))
      .filter(filter => filter.label);
  }

  // Get sort options based on filter type
  const getSortOptions = () => {
    switch(filterType) {
      case 'job_seeker':
        return [
          { value: '-rating', label: 'Highest Rated' },
          { value: 'rating', label: 'Lowest Rated' },
          { value: '-completed_projects', label: 'Most Projects' },
          { value: 'completed_projects', label: 'Fewest Projects' },
          { value: '-user__date_joined', label: 'Newest' },
          { value: 'user__date_joined', label: 'Oldest' }
        ];
      case 'job':
        return [
          { value: '-posted_at', label: 'Newest First' },
          { value: 'posted_at', label: 'Oldest First' },
          { value: '-applications_count', label: 'Most Applicants' },
          { value: 'applications_count', label: 'Fewest Applicants' },
          { value: '-salary_range', label: 'Highest Salary' },
          { value: 'salary_range', label: 'Lowest Salary' }
        ];
      case 'artist':
        return [
          { value: '-rating', label: 'Highest Rated' },
          { value: 'rating', label: 'Lowest Rated' },
          { value: '-total_likes', label: 'Most Likes' },
          { value: 'total_likes', label: 'Fewest Likes' },
          { value: '-followers_count', label: 'Most Followers' },
          { value: 'followers_count', label: 'Fewest Followers' }
        ];
      default:
        return [
          { value: '-created_at', label: 'Newest First' },
          { value: 'created_at', label: 'Oldest First' },
          { value: '-rating', label: 'Highest Rated' },
          { value: 'rating', label: 'Lowest Rated' }
        ];
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex flex-col space-y-4">
        {/* Main Search Bar */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} className="bg-gradient-primary hover:opacity-90">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button 
            variant="outline" 
            onClick={handleResetFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Reset
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Experience Level Filter */}
          {showExperienceFilter && availableFilters.experience_levels && (
            <Select 
              value={filters.experience} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, experience: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_experience">All Experience Levels</SelectItem>
                {Object.entries(availableFilters.experience_levels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Location Filter */}
          {showLocationFilter && availableFilters.locations && availableFilters.locations.length > 0 && (
            <Select 
              value={filters.location} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_locations">All Locations</SelectItem>
                {availableFilters.locations.map((location) => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Skills Filter */}
          {showSkillsFilter && availableFilters.popular_skills && (
            <Select 
              value={filters.skills} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, skills: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Skills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_skills">All Skills</SelectItem>
                {availableFilters.popular_skills.map((skill) => (
                  <SelectItem key={skill.name} value={skill.name}>
                    {skill.name} ({skill.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Job Type Filter */}
          {showJobTypeFilter && (
            <Select 
              value={filters.jobType} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, jobType: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_job_types">All Job Types</SelectItem>
                <SelectItem value="full_time">Full Time</SelectItem>
                <SelectItem value="part_time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="temporary">Temporary</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Remote Filter */}
          {showRemoteFilter && (
            <Select 
              value={filters.remote} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, remote: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Remote Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_remote">All Locations</SelectItem>
                <SelectItem value="true">Remote Only</SelectItem>
                <SelectItem value="false">On-site Only</SelectItem>
                <SelectItem value="hybrid">Hybrid Available</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Category Filter */}
          {showCategoryFilter && (availableFilters.categories || availableFilters.portfolio_categories) && (
            <Select 
              value={filters.category} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_categories">All Categories</SelectItem>
                {Object.entries(availableFilters.categories || availableFilters.portfolio_categories || {}).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Availability Filter */}
          {showAvailableFilter && (
            <Select 
              value={filters.available} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, available: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_availability">All Artists</SelectItem>
                <SelectItem value="true">Available Only</SelectItem>
                <SelectItem value="false">Not Available</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Sort Order */}
          <Select 
            value={filters.ordering} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, ordering: value }))}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {getSortOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={handleSearch}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Search Tips */}
        <div className="text-xs text-muted-foreground pt-2 border-t border-border">
          <p>💡 Try searching by: name, title, skills, or location</p>
        </div>

        {/* Active Filters */}
        {hasActiveFilters() && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {getActiveFilters().map((filter) => (
              <div 
                key={filter.key} 
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
              >
                <span className="capitalize">{filter.key}:</span>
                <span className="font-medium">{filter.label}</span>
                <button 
                  onClick={() => removeFilter(filter.key)}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleResetFilters}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar
