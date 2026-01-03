import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { getJobSeekerFilters } from "@/services/apiClient"

interface SearchBarProps {
  placeholder?: string
  showRoleFilter?: boolean
  showLocationFilter?: boolean
  showSkillsFilter?: boolean
  showInvestmentFilter?: boolean
  showJobTypeFilter?: boolean
  showExperienceFilter?: boolean
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
  onSearch 
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    experience: "all_experience",
    location: "all_locations",
    skills: "all_skills",
    investmentRange: "all_investment",
    jobType: "all_job_types",
    ordering: "-rating"
  })
  const [availableFilters, setAvailableFilters] = useState<{
    experience_levels?: Record<string, string>;
    popular_skills?: Array<{name: string; count: number}>;
    locations?: string[];
  }>({})

  // Load available filters from API
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await getJobSeekerFilters()
        setAvailableFilters(data)
      } catch (error) {
        console.error('Failed to load filters:', error)
      }
    }
    
    if (showExperienceFilter || showSkillsFilter || showLocationFilter) {
      loadFilters()
    }
  }, [showExperienceFilter, showSkillsFilter, showLocationFilter])

  const handleSearch = () => {
    // Convert "all_" values back to empty strings for API
    const apiFilters = {
      experience: filters.experience === "all_experience" ? "" : filters.experience,
      location: filters.location === "all_locations" ? "" : filters.location,
      skills: filters.skills === "all_skills" ? "" : filters.skills,
      investmentRange: filters.investmentRange === "all_investment" ? "" : filters.investmentRange,
      jobType: filters.jobType === "all_job_types" ? "" : filters.jobType,
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
      ordering: "-rating"
    })
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
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
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
              <SelectItem value="-rating">Highest Rated</SelectItem>
              <SelectItem value="rating">Lowest Rated</SelectItem>
              <SelectItem value="-completed_projects">Most Projects</SelectItem>
              <SelectItem value="completed_projects">Fewest Projects</SelectItem>
              <SelectItem value="-user__date_joined">Newest</SelectItem>
              <SelectItem value="user__date_joined">Oldest</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={handleSearch}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Search Tips */}
        <div className="text-xs text-muted-foreground pt-2 border-t border-border">
          <p>💡 Try searching by: name, job title, skills (React, Python, Design), or location</p>
        </div>

        {/* Active Filters (if any) */}
        {(filters.experience !== "all_experience" || 
          filters.location !== "all_locations" || 
          filters.skills !== "all_skills" || 
          filters.jobType !== "all_job_types") && (
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">Active filters:</span>
            {filters.experience !== "all_experience" && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                {availableFilters.experience_levels?.[filters.experience] || filters.experience}
              </span>
            )}
            {filters.location !== "all_locations" && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                {filters.location}
              </span>
            )}
            {filters.skills !== "all_skills" && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                {filters.skills}
              </span>
            )}
            {filters.jobType !== "all_job_types" && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                {filters.jobType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar
