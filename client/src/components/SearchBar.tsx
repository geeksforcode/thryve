import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface SearchBarProps {
  placeholder?: string
  showRoleFilter?: boolean
  showLocationFilter?: boolean
  showSkillsFilter?: boolean
  showInvestmentFilter?: boolean
  showJobTypeFilter?: boolean
  onSearch?: (query: string, filters: any) => void
}

const SearchBar = ({ 
  placeholder = "Search...", 
  showRoleFilter = true,
  showLocationFilter = true,
  showSkillsFilter = false,
  showInvestmentFilter = false,
  showJobTypeFilter = false,
  onSearch 
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    role: "",
    location: "",
    skills: "",
    investmentRange: "",
    jobType: ""
  })

  const handleSearch = () => {
    onSearch?.(searchQuery, filters)
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
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} className="bg-gradient-primary hover:opacity-90">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {showRoleFilter && (
            <Select value={filters.role} onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="job-seeker">Job Seeker</SelectItem>
                <SelectItem value="artist">Artist</SelectItem>
                <SelectItem value="investor">Investor</SelectItem>
                <SelectItem value="employer">Employer</SelectItem>
              </SelectContent>
            </Select>
          )}

          {showLocationFilter && (
            <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="new-york">New York</SelectItem>
                <SelectItem value="san-francisco">San Francisco</SelectItem>
                <SelectItem value="london">London</SelectItem>
                <SelectItem value="toronto">Toronto</SelectItem>
              </SelectContent>
            </Select>
          )}

          {showSkillsFilter && (
            <Select value={filters.skills} onValueChange={(value) => setFilters(prev => ({ ...prev, skills: value }))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Skills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
              </SelectContent>
            </Select>
          )}

          {showInvestmentFilter && (
            <Select value={filters.investmentRange} onValueChange={(value) => setFilters(prev => ({ ...prev, investmentRange: value }))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Investment Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-10k">$0 - $10K</SelectItem>
                <SelectItem value="10k-50k">$10K - $50K</SelectItem>
                <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                <SelectItem value="100k+">$100K+</SelectItem>
              </SelectContent>
            </Select>
          )}

          {showJobTypeFilter && (
            <Select value={filters.jobType} onValueChange={(value) => setFilters(prev => ({ ...prev, jobType: value }))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar