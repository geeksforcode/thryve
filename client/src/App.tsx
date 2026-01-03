import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JobSeekerListings from "./pages/JobSeekerListings";
import ArtistListings from "./pages/ArtistListings";
import InvestorListings from "./pages/InvestorListings";
import JobListings from "./pages/JobListings";
import JobSeekerProfile from "./pages/JobSeekerProfile";
import ArtistProfile from "./pages/ArtistProfile";
import EmployerProfile from "./pages/EmployerProfile";
import InvestorProfile from "./pages/InvestorProfile";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import PremiumUpgrade from "./pages/PremiumUpgrade";
import Auth from "./pages/Auth";
import FacebookCallbackPage from "./pages/FacebookcallbackPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import AuthSuccess from "./pages/AuthSuccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth-success" element={<AuthSuccess />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            
            {/* Auth Callbacks */}
            <Route path="/auth/facebook/callback" element={<FacebookCallbackPage />} />
            <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

            {/* Protected Routes - Role Specific */}
            
            {/* Job Seeker Routes */}
            <Route path="/profile/job-seeker" element={
              <ProtectedRoute requiredRole="job_seeker">
                <JobSeekerProfile />
              </ProtectedRoute>
            } />
            <Route path="/listings/jobs" element={
              <ProtectedRoute requiredRole="job_seeker">
                <JobListings />
              </ProtectedRoute>
            } />

            {/* Artist Routes */}
            <Route path="/profile/artist" element={
              <ProtectedRoute requiredRole="artist">
                <ArtistProfile />
              </ProtectedRoute>
            } />
            <Route path="/listings/artists" element={
              <ProtectedRoute>
                <ArtistListings />
              </ProtectedRoute>
            } />

            {/* Investor Routes */}
            <Route path="/profile/investor" element={
              <ProtectedRoute requiredRole="investor">
                <InvestorProfile />
              </ProtectedRoute>
            } />
            <Route path="/listings/investors" element={
              <ProtectedRoute>
                <InvestorListings />
              </ProtectedRoute>
            } />

            {/* Employer Routes */}
            <Route path="/profile/employer" element={
              <ProtectedRoute requiredRole="employer">
                <EmployerProfile />
              </ProtectedRoute>
            } />
            <Route path="/listings/job-seekers" element={
              <ProtectedRoute requiredRole="employer">
                <JobSeekerListings />
              </ProtectedRoute>
            } />

            {/* Common Protected Routes (all authenticated users) */}
            <Route path="/upgrade" element={
              <ProtectedRoute>
                <PremiumUpgrade />
              </ProtectedRoute>
            } />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
