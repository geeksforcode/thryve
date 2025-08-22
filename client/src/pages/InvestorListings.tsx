import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Briefcase, TrendingUp, Building } from "lucide-react"
import SearchBar from "@/components/SearchBar"
import Navigation from "@/components/Navigation"
import { useEffect, useState } from "react";
import { getAllInvestors } from "@/api";

const InvestorListings = () => {
  // Mock data for investors
  const investors = [
    {
      id: 1,
      name: "Alexandra Reed",
      avatar: "/placeholder.svg",
      title: "Venture Capitalist",
      company: "Tech Ventures Capital",
      location: "Silicon Valley, CA",
      industry: ["FinTech", "SaaS", "AI/ML"],
      investmentRange: "$100K - $2M",
      bio: "Experienced investor focused on early-stage tech startups with strong growth potential.",
      pastInvestments: ["CloudSync", "DataFlow", "SmartPay"],
      totalInvestments: 24,
      successfulExits: 8,
    },
    {
      id: 2,
      name: "Robert Martinez",
      avatar: "/placeholder.svg",
      title: "Angel Investor",
      company: "Independent",
      location: "Austin, TX",
      industry: ["Healthcare", "EdTech", "GreenTech"],
      investmentRange: "$25K - $500K",
      bio: "Former healthcare executive now investing in innovative startups transforming industries.",
      pastInvestments: ["MedConnect", "EcoSolutions", "LearnPath"],
      totalInvestments: 18,
      successfulExits: 5,
    },
    {
      id: 3,
      name: "Jennifer Chen",
      avatar: "/placeholder.svg",
      title: "Investment Partner",
      company: "Growth Equity Partners",
      location: "New York, NY",
      industry: ["E-commerce", "MarTech", "Consumer"],
      investmentRange: "$500K - $5M",
      bio: "Growth stage investor with expertise in scaling consumer-focused technology companies.",
      pastInvestments: ["ShopSmart", "AdTech Pro", "FoodieHub"],
      totalInvestments: 31,
      successfulExits: 12,
    },
    {
      id: 4,
      name: "Michael Thompson",
      avatar: "/placeholder.svg",
      title: "Corporate Investor",
      company: "Innovation Labs Inc",
      location: "Boston, MA",
      industry: ["B2B Software", "Enterprise", "Cybersecurity"],
      investmentRange: "$250K - $3M",
      bio: "Corporate venture capital focusing on B2B solutions that enhance enterprise efficiency.",
      pastInvestments: ["SecureNet", "WorkFlow", "DataShield"],
      totalInvestments: 22,
      successfulExits: 7,
    },
  ]

    const [investorss, setInvestors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchInvestors = async () => {
        try {
          const data = await getAllInvestors(); 
          setInvestors(data);
        } catch (err) {
          console.error("Failed to fetch investors:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchInvestors();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading Investors...</div>

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

          {/* Investor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investors.map((investor) => (
              <Card key={investor.id} className="shadow-card hover:shadow-card-hover transition-smooth">
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={investor.avatar} alt={investor.name} />
                    <AvatarFallback>{investor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <h3 className="font-heading font-semibold text-lg text-foreground">
                    {investor.name}
                  </h3>
                  <p className="text-primary font-medium">{investor.title}</p>
                  
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
                  <p className="text-muted-foreground text-sm text-center">
                    {investor.bio}
                  </p>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-sm font-medium text-primary mb-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>{investor.investmentRange}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
                      Industry Focus
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {investor.industry.map((focus) => (
                        <Badge key={focus} variant="secondary" className="text-xs">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center text-sm">
                    <div>
                      <div className="font-semibold text-foreground">{investor.totalInvestments}</div>
                      <div className="text-muted-foreground text-xs">Investments</div>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{investor.successfulExits}</div>
                      <div className="text-muted-foreground text-xs">Exits</div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
                      Recent Investments
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {investor.pastInvestments.slice(0, 3).map((investment) => (
                        <Badge key={investment} variant="outline" className="text-xs">
                          {investment}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button className="w-full bg-gradient-primary hover:opacity-90">
                    View Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Investors
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default InvestorListings