import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Briefcase, TrendingUp, Building, ExternalLink, Loader2, Plus } from "lucide-react"
import SearchBar from "@/components/SearchBar"
import Navigation from "@/components/Navigation"
import { useEffect, useState } from "react";
import { getInvestors } from "@/services/apiClient";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Investor {
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

const InvestorListings = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getInvestors({ 
          page: 1,
          ordering: '-total_portfolio_value' 
        });
        
        // Handle different response formats
        if (Array.isArray(data)) {
          setInvestors(data);
          setHasMore(false);
        } else if (data && data.results) {
          setInvestors(data.results);
          setHasMore(!!data.next);
        } else {
          setInvestors([]);
          setHasMore(false);
        }
        
      } catch (err: any) {
        console.error("Failed to fetch investors:", err);
        setError(err.message || "Failed to load investors");
        setInvestors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInvestors();
  }, []);

  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      const data = await getInvestors({ 
        page: nextPage,
        ordering: '-total_portfolio_value' 
      });
      
      if (Array.isArray(data)) {
        setInvestors(prev => [...prev, ...data]);
        setHasMore(false);
      } else if (data && data.results) {
        setInvestors(prev => [...prev, ...data.results]);
        setHasMore(!!data.next);
        setPage(nextPage);
      }
    } catch (err: any) {
      console.error("Failed to load more investors:", err);
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

  if (loading && investors.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex flex-col justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading investors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
              Investor Network
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with investors who can fuel your startup's growth
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar 
              placeholder="Search investors by name, industry, or investment range..."
              showInvestmentFilter={true}
              showRoleFilter={false}
            />
          </div>

          {/* Create Profile Button for Investors */}
          {isAuthenticated && user?.role === 'investor' && (
            <div className="mb-6 flex justify-end">
              <Button asChild className="bg-gradient-primary">
                <Link to="/profile/investor">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your Investor Profile
                </Link>
              </Button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
              {error}
            </div>
          )}

          {/* Investor Cards */}
          {investors.length === 0 && !loading ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Building className="h-16 w-16 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  No Investors Found
                </h2>
                <p className="text-muted-foreground mb-6">
                  Be the first investor to join our platform and connect with talented artists.
                </p>
                {isAuthenticated && user?.role === 'investor' ? (
                  <Button asChild className="bg-gradient-primary">
                    <Link to="/profile/investor">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Investor Profile
                    </Link>
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Are you an investor? Join our platform today!
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button asChild variant="outline">
                        <Link to="/auth?role=investor">
                          Sign Up as Investor
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link to="/auth">
                          Login
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investors.map((investor) => (
                  <Card key={investor.id} className="shadow-card hover:shadow-card-hover transition-smooth">
                    <CardHeader className="text-center">
                      <Avatar className="w-20 h-20 mx-auto mb-4">
                        <AvatarImage 
                          src={investor.user.profile_picture} 
                          alt={`${investor.user.first_name} ${investor.user.last_name}`} 
                        />
                        <AvatarFallback>
                          {getInitials(investor.user.first_name, investor.user.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <h3 className="font-heading font-semibold text-lg text-foreground">
                        {investor.user.first_name} {investor.user.last_name}
                      </h3>
                      <p className="text-primary font-medium">{investor.position}</p>
                      
                      <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-2">
                        <Building className="h-4 w-4" />
                        <span>{investor.company}</span>
                      </div>
                      
                      <div className="flex items-center justify-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {investor.location}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm text-center line-clamp-3">
                        {investor.bio}
                      </p>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-sm font-medium text-primary mb-2">
                          <TrendingUp className="h-4 w-4" />
                          <span>{formatInvestmentRange(
                            investor.investment_range_min, 
                            investor.investment_range_max
                          )}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {getInvestorTypeLabel(investor.investor_type)}
                        </Badge>
                      </div>
                      
                      {investor.focus_industries && investor.focus_industries.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
                            Industry Focus
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {investor.focus_industries.slice(0, 3).map((focus, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {focus}
                              </Badge>
                            ))}
                            {investor.focus_industries.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{investor.focus_industries.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 text-center text-sm">
                        <div>
                          <div className="font-semibold text-foreground">
                            {investor.total_investments}
                          </div>
                          <div className="text-muted-foreground text-xs">Investments</div>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">
                            {investor.successful_exits}
                          </div>
                          <div className="text-muted-foreground text-xs">Exits</div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
                          Investment Stage
                        </p>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {investor.investment_stages && investor.investment_stages.slice(0, 2).map((stage, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {stage}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {!investor.is_accepting_pitches && (
                        <div className="text-center">
                          <Badge variant="destructive" className="text-xs">
                            Not Accepting Pitches
                          </Badge>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter>
                      <Button 
                        className="w-full bg-gradient-primary hover:opacity-90"
                        asChild
                      >
                        <Link to={`/investor/${investor.id}`}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Profile
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              {hasMore && investors.length > 0 && (
                <div className="text-center mt-12">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More Investors'
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

export default InvestorListings
