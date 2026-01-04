import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  UserPlus,
  LogIn,
  Briefcase,
  Palette,
  TrendingUp,
  Building,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { loginWithFacebook, loginWithGoogle, register, updateProfile, login } from "@/services/apiClient";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  const roleFromUrl = queryParams.get("role") || "";
  const returnUrl = queryParams.get("returnUrl") || "/";
  const message = queryParams.get("message");
  
  const [selectedRole, setSelectedRole] = useState(roleFromUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signup");

  useEffect(() => {
    // If role is specified in URL, pre-select it
    if (roleFromUrl) {
      setSelectedRole(roleFromUrl);
      setFormData(prev => ({ ...prev, role: roleFromUrl }));
    }

    // Show message if present in URL
    if (message) {
      toast({
        title: "Action Required",
        description: decodeURIComponent(message),
        variant: "default",
      });
    }
  }, [roleFromUrl, message]);

  const roles = [
    {
      value: "job_seeker",
      label: "Job Seeker",
      icon: Briefcase,
      description: "Find your next career opportunity",
      color: "blue",
    },
    {
      value: "artist",
      label: "Artist",
      icon: Palette,
      description: "Showcase your creative portfolio",
      color: "purple",
    },
    {
      value: "investor",
      label: "Investor",
      icon: TrendingUp,
      description: "Discover investment opportunities",
      color: "green",
    },
    {
      value: "employer",
      label: "Employer",
      icon: Building,
      description: "Find the right talent for your team",
      color: "orange",
    },
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: roleFromUrl || "job_seeker",
    acceptTerms: false,
    experience: "",
    specialty: "",
    investmentRange: "",
    companySize: "",
  });

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setFormData({
      ...formData,
      role: role,
    });
  };

  const getRoleColor = (roleValue: string) => {
    const role = roles.find(r => r.value === roleValue);
    return role?.color || "blue";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match!",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Error",
        description: "Please accept the Terms of Service",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!selectedRole) {
      toast({
        title: "Error",
        description: "Please select a role",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log("Registration data:", {
        username: formData.username || formData.email.split('@')[0],
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      // Register user with Django
      const response = await register({
        username: formData.username || formData.email.split('@')[0],
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      
      console.log("Registration response:", response);

      // Django returns success directly, no status check needed
      if (response.user || response.message === 'User created successfully') {
        // Store tokens if they're in the response
        if (response.access) {
          localStorage.setItem("access", response.access);
        }
        if (response.refresh) {
          localStorage.setItem("refresh", response.refresh);
        }
        
        // ✅ CRITICAL: Update AuthContext state for registration
        if (response.access && response.refresh) {
          authLogin({ 
            access: response.access, 
            refresh: response.refresh 
          });
        }
        
        // Update profile with additional role-specific data
        const profileData: any = {
          role: selectedRole,
        };
        
        // Add role-specific fields (optional - can be updated later)
        if (selectedRole === "job_seeker" && formData.experience) {
          profileData.experience = formData.experience;
        } else if (selectedRole === "artist" && formData.specialty) {
          profileData.specialty = formData.specialty;
        } else if (selectedRole === "investor" && formData.investmentRange) {
          profileData.investmentRange = formData.investmentRange;
        } else if (selectedRole === "employer" && formData.companySize) {
          profileData.companySize = formData.companySize;
        }
        
        // Update profile if we have additional data
        if (Object.keys(profileData).length > 1) {
          try {
            await updateProfile(profileData);
          } catch (updateError) {
            console.warn("Profile update failed, but user was created:", updateError);
          }
        }
        
        // Show success toast
        toast({
          title: "Welcome to Thryve! 🎉",
          description: `Your ${selectedRole.replace('_', ' ')} account has been created successfully.`,
          variant: "default",
        });
        
        // Add delay to ensure AuthContext updates
        setTimeout(() => {
          // Redirect based on role and returnUrl
          if (returnUrl && returnUrl !== "/") {
            navigate(returnUrl);
          } else {
            // Default redirect based on role
            switch (selectedRole) {
              case "artist":
                navigate("/profile/artist");
                break;
              case "investor":
                navigate("/profile/investor");
                break;
              case "employer":
                navigate("/profile/employer");
                break;
              case "job_seeker":
                navigate("/profile/job-seeker");
                break;
              default:
                navigate("/");
            }
          }
        }, 300); // Small delay for state update
      } else {
        console.error("Registration failed:", response);
        toast({
          title: "Registration Failed",
          description: response.detail || response.message || "Registration failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error during registration:", error);
      toast({
        title: "Registration Error",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log("Login attempt with:", { email: loginData.email });

      // Call login API
      const response = await login({
        email: loginData.email,
        password: loginData.password,
      });

      console.log("Login response:", response);
      console.log("User role from response:", response.user?.role);

      if (response.access) {
        // Store tokens
        localStorage.setItem("access", response.access);
        localStorage.setItem("refresh", response.refresh);
        
        // ✅ CRITICAL: Update AuthContext state
        authLogin({ 
          access: response.access, 
          refresh: response.refresh 
        });
        
        // Store user data for debugging
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        
        // Store remember me preference
        if (loginData.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }

        // Show success toast
        toast({
          title: "Welcome Back! 👋",
          description: "You have been successfully logged in.",
          variant: "default",
        });

        // Add delay to ensure AuthContext updates before navigation
        setTimeout(() => {
          // Get user role - try different possible locations in the response
          const userRole = response.user?.role || 
                          (response.user && response.user.profile?.role) || 
                          'job_seeker'; // fallback
          
          console.log("User role for navigation:", userRole);
          console.log("Return URL:", returnUrl);

          // Redirect to returnUrl or default based on user role
          if (returnUrl && returnUrl !== "/") {
            console.log("Redirecting to returnUrl:", returnUrl);
            navigate(returnUrl);
          } else {
            // Default redirect based on role
            switch (userRole) {
              case "artist":
                navigate("/profile/artist");
                break;
              case "investor":
                navigate("/profile/investor");
                break;
              case "employer":
                navigate("/profile/employer");
                break;
              case "job_seeker":
              default:
                navigate("/profile/job-seeker");
                break;
            }
          }
        }, 300); // Increased delay to ensure AuthContext updates
      } else {
        toast({
          title: "Login Failed",
          description: response.detail || "Login failed. Please check your credentials.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // More user-friendly error messages
      if (error.message.includes("401") || error.message.includes("Invalid credentials")) {
        toast({
          title: "Invalid Credentials",
          description: "The email or password you entered is incorrect.",
          variant: "destructive",
        });
      } else if (error.message.includes("network")) {
        toast({
          title: "Network Error",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Error",
          description: error.message || "An error occurred during login. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social login
  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    
    // Add returnUrl to social login if it exists
    const socialLoginUrl = provider === 'google' 
      ? loginWithGoogle()
      : loginWithFacebook();
    
    // Note: Social login redirects are handled by the backend
    // The backend should handle the returnUrl parameter
  };

  // Forgot password handler
  const handleForgotPassword = () => {
    toast({
      title: "Coming Soon",
      description: "Password reset feature is coming soon!",
      variant: "default",
    });
  };

  // Get role-specific welcome message
  const getRoleWelcomeMessage = () => {
    const role = roles.find(r => r.value === roleFromUrl);
    if (role) {
      return `Sign up as an ${role.label.toLowerCase()} to access exclusive features`;
    }
    return "";
  };

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

          {/* Role-specific welcome message */}
          {roleFromUrl && (
            <div className={`mb-6 p-4 rounded-lg bg-${getRoleColor(roleFromUrl)}/10 border border-${getRoleColor(roleFromUrl)}/20`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full bg-${getRoleColor(roleFromUrl)}/20`}>
                  <Sparkles className={`h-5 w-5 text-${getRoleColor(roleFromUrl)}-600`} />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-foreground">
                    {getRoleWelcomeMessage()}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {roleFromUrl === 'artist' 
                      ? "Connect with investors and showcase your creative work"
                      : roleFromUrl === 'investor'
                      ? "Discover talented artists and innovative projects"
                      : roleFromUrl === 'employer'
                      ? "Find skilled professionals for your team"
                      : "Find your perfect career opportunity"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-center">
                {activeTab === "signup" ? "Create Your Account" : "Welcome Back"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue="signup" 
                className="w-full"
                value={activeTab}
                onValueChange={setActiveTab}
              >
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
                          className={`border rounded-lg p-3 cursor-pointer transition-smooth hover:border-primary hover:shadow-sm ${
                            selectedRole === role.value
                              ? `border-${role.color}-500 bg-${role.color}-50/30 shadow-sm`
                              : "border-border"
                          }`}
                          onClick={() => handleRoleSelect(role.value)}
                        >
                          <div className="flex flex-col items-center text-center space-y-2">
                            <div className={`p-2 rounded-full bg-${role.color}-100`}>
                              <role.icon
                                className={`h-5 w-5 ${selectedRole === role.value ? `text-${role.color}-600` : "text-muted-foreground"}`}
                              />
                            </div>
                            <div>
                              <div
                                className={`text-sm font-medium ${selectedRole === role.value ? `text-${role.color}-600` : "text-foreground"}`}
                              >
                                {role.label}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {role.description}
                              </div>
                            </div>
                            {selectedRole === role.value && (
                              <div className="mt-1">
                                <CheckCircle className={`h-4 w-4 text-${role.color}-600`} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sign Up Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input 
                          id="firstName" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John" 
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input 
                          id="lastName" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe" 
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="username">Username (Optional)</Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="johndoe"
                        disabled={isLoading}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        If left blank, we'll create one from your email
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum 8 characters with letters and numbers
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {/* Role-specific fields */}
                    {selectedRole === "job_seeker" && (
                      <div>
                        <Label htmlFor="experience">Experience Level (Optional)</Label>
                        <Select 
                          value={formData.experience}
                          onValueChange={(value) => handleSelectChange("experience", value)}
                          disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entry">
                              Entry Level (0-2 years)
                            </SelectItem>
                            <SelectItem value="mid">
                              Mid Level (3-5 years)
                            </SelectItem>
                            <SelectItem value="senior">
                              Senior Level (6+ years)
                            </SelectItem>
                            <SelectItem value="executive">
                              Executive Level
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          You can update this later in your profile
                        </p>
                      </div>
                    )}

                    {selectedRole === "artist" && (
                      <div>
                        <Label htmlFor="specialty">Artistic Specialty (Optional)</Label>
                        <Select 
                          value={formData.specialty}
                          onValueChange={(value) => handleSelectChange("specialty", value)}
                          disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="digital-art">
                              Digital Art
                            </SelectItem>
                            <SelectItem value="photography">
                              Photography
                            </SelectItem>
                            <SelectItem value="graphic-design">
                              Graphic Design
                            </SelectItem>
                            <SelectItem value="illustration">
                              Illustration
                            </SelectItem>
                            <SelectItem value="3d-modeling">
                              3D Modeling
                            </SelectItem>
                            <SelectItem value="animation">Animation</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Helps investors find artists with specific skills
                        </p>
                      </div>
                    )}

                    {selectedRole === "investor" && (
                      <div>
                        <Label htmlFor="investmentRange">
                          Investment Range (Optional)
                        </Label>
                        <Select 
                          value={formData.investmentRange}
                          onValueChange={(value) => handleSelectChange("investmentRange", value)}
                          disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select investment range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-10k">$0 - $10K</SelectItem>
                            <SelectItem value="10k-50k">$10K - $50K</SelectItem>
                            <SelectItem value="50k-100k">
                              $50K - $100K
                            </SelectItem>
                            <SelectItem value="100k-500k">
                              $100K - $500K
                            </SelectItem>
                            <SelectItem value="500k+">$500K+</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Helps artists understand your investment capacity
                        </p>
                      </div>
                    )}

                    {selectedRole === "employer" && (
                      <div>
                        <Label htmlFor="companySize">Company Size (Optional)</Label>
                        <Select 
                          value={formData.companySize}
                          onValueChange={(value) => handleSelectChange("companySize", value)}
                          disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="startup">
                              Startup (1-10 employees)
                            </SelectItem>
                            <SelectItem value="small">
                              Small (11-50 employees)
                            </SelectItem>
                            <SelectItem value="medium">
                              Medium (51-200 employees)
                            </SelectItem>
                            <SelectItem value="large">
                              Large (201+ employees)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Helps job seekers understand your organization
                        </p>
                      </div>
                    )}

                    <div className="flex items-start space-x-2 pt-2">
                      <Checkbox 
                        id="terms" 
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => 
                          setFormData({...formData, acceptTerms: checked as boolean})
                        }
                        disabled={isLoading}
                        className="mt-1"
                      />
                      <div className="space-y-1">
                        <Label
                          htmlFor="terms"
                          className="text-sm text-muted-foreground leading-tight"
                        >
                          I agree to the{" "}
                          <a href="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </a>
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          By creating an account, you acknowledge that you have read and agree to our terms.
                        </p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-primary hover:opacity-90"
                      disabled={!selectedRole || !formData.acceptTerms || isLoading}
                    >
                      {isLoading && activeTab === "signup" ? (
                        <>
                          <span className="mr-2">Creating Account...</span>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        </>
                      ) : (
                        `Create ${selectedRole ? roles.find(r => r.value === selectedRole)?.label : 'Account'}`
                      )}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => handleSocialLogin('google')}
                      disabled={isLoading}
                      className="relative"
                    >
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleSocialLogin('facebook')}
                      disabled={isLoading}
                      className="relative"
                    >
                      <svg
                        className="h-4 w-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </Button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Button 
                      type="button" 
                      variant="link" 
                      className="text-sm p-0 font-medium"
                      onClick={() => setActiveTab("signin")}
                    >
                      Sign in here
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="signin" className="space-y-6">
                  {/* Sign In Form */}
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="signInEmail">Email</Label>
                      <Input
                        id="signInEmail"
                        name="email"
                        type="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        placeholder="john@example.com"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="signInPassword">Password</Label>
                      <Input
                        id="signInPassword"
                        name="password"
                        type="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="remember" 
                          name="rememberMe"
                          checked={loginData.rememberMe}
                          onCheckedChange={(checked) => 
                            setLoginData({...loginData, rememberMe: checked as boolean})
                          }
                          disabled={isLoading}
                        />
                        <Label htmlFor="remember" className="text-sm">
                          Remember me
                        </Label>
                      </div>
                      <Button 
                        type="button" 
                        variant="link" 
                        className="text-sm p-0"
                        onClick={handleForgotPassword}
                        disabled={isLoading}
                      >
                        Forgot password?
                      </Button>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-gradient-primary hover:opacity-90"
                      disabled={isLoading}
                    >
                      {isLoading && activeTab === "signin" ? (
                        <>
                          <span className="mr-2">Signing In...</span>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline"
                      onClick={() => handleSocialLogin('google')}
                      disabled={isLoading}
                    >
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleSocialLogin('facebook')}
                      disabled={isLoading}
                    >
                      <svg
                        className="h-4 w-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </Button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Button 
                      type="button" 
                      variant="link" 
                      className="text-sm p-0 font-medium"
                      onClick={() => setActiveTab("signup")}
                    >
                      Sign up here
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer links */}
          <div className="mt-6 text-center text-sm text-muted-foreground space-y-2">
            <p>
              By continuing, you agree to our{" "}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
            {returnUrl && returnUrl !== "/" && (
              <p className="text-xs">
                You'll be redirected back to your previous page after signing in
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
