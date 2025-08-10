import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import Navigation from "@/components/Navigation"
import { useState } from "react"
import { UserPlus, LogIn, Briefcase, Palette, TrendingUp, Building } from "lucide-react"

const Auth = () => {
  const [selectedRole, setSelectedRole] = useState("")

  const roles = [
    {
      value: "job-seeker",
      label: "Job Seeker",
      icon: Briefcase,
      description: "Find your next career opportunity"
    },
    {
      value: "artist",
      label: "Artist",
      icon: Palette,
      description: "Showcase your creative portfolio"
    },
    {
      value: "investor",
      label: "Investor",
      icon: TrendingUp,
      description: "Discover investment opportunities"
    },
    {
      value: "employer",
      label: "Employer",
      icon: Building,
      description: "Find the right talent for your team"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Welcome to Thryve
            </h1>
            <p className="text-muted-foreground">
              Join the platform where talent meets opportunity
            </p>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-center">Get Started</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signup" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signup" className="flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </TabsTrigger>
                  <TabsTrigger value="signin" className="flex items-center">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signup" className="space-y-6">
                  {/* Role Selection */}
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      I am a...
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {roles.map((role) => (
                        <div
                          key={role.value}
                          className={`border rounded-lg p-3 cursor-pointer transition-smooth hover:border-primary ${
                            selectedRole === role.value ? 'border-primary bg-primary/5' : 'border-border'
                          }`}
                          onClick={() => setSelectedRole(role.value)}
                        >
                          <div className="flex flex-col items-center text-center space-y-2">
                            <role.icon className={`h-6 w-6 ${selectedRole === role.value ? 'text-primary' : 'text-muted-foreground'}`} />
                            <div>
                              <div className={`text-sm font-medium ${selectedRole === role.value ? 'text-primary' : 'text-foreground'}`}>
                                {role.label}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {role.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sign Up Form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="••••••••" />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" placeholder="••••••••" />
                    </div>

                    {selectedRole === "job-seeker" && (
                      <div>
                        <Label htmlFor="experience">Experience Level</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                            <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                            <SelectItem value="senior">Senior Level (6+ years)</SelectItem>
                            <SelectItem value="executive">Executive Level</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {selectedRole === "artist" && (
                      <div>
                        <Label htmlFor="specialty">Artistic Specialty</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="digital-art">Digital Art</SelectItem>
                            <SelectItem value="photography">Photography</SelectItem>
                            <SelectItem value="graphic-design">Graphic Design</SelectItem>
                            <SelectItem value="illustration">Illustration</SelectItem>
                            <SelectItem value="3d-modeling">3D Modeling</SelectItem>
                            <SelectItem value="animation">Animation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {selectedRole === "investor" && (
                      <div>
                        <Label htmlFor="investmentRange">Investment Range</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select investment range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-10k">$0 - $10K</SelectItem>
                            <SelectItem value="10k-50k">$10K - $50K</SelectItem>
                            <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                            <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                            <SelectItem value="500k+">$500K+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {selectedRole === "employer" && (
                      <div>
                        <Label htmlFor="companySize">Company Size</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                            <SelectItem value="small">Small (11-50 employees)</SelectItem>
                            <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                            <SelectItem value="large">Large (201+ employees)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm text-muted-foreground">
                        I agree to the Terms of Service and Privacy Policy
                      </Label>
                    </div>

                    <Button className="w-full bg-gradient-primary hover:opacity-90" disabled={!selectedRole}>
                      Create Account
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline">
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline">
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="signin" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="signInEmail">Email</Label>
                      <Input id="signInEmail" type="email" placeholder="john@example.com" />
                    </div>

                    <div>
                      <Label htmlFor="signInPassword">Password</Label>
                      <Input id="signInPassword" type="password" placeholder="••••••••" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember" className="text-sm">Remember me</Label>
                      </div>
                      <Button variant="link" className="text-sm p-0">
                        Forgot password?
                      </Button>
                    </div>

                    <Button className="w-full bg-gradient-primary hover:opacity-90">
                      Sign In
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline">
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline">
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Auth