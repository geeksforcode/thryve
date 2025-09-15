import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
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
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path="/listings/job-seekers" element={<JobSeekerListings />} />
          <Route path="/listings/artists" element={<ArtistListings />} />
          <Route path="/listings/investors" element={<InvestorListings />} />
          <Route path="/listings/jobs" element={<JobListings />} />
          <Route path="/profile/job-seeker" element={<JobSeekerProfile />} />
          <Route path="/profile/artist" element={<ArtistProfile />} />
          <Route path="/profile/employer" element={<EmployerProfile />} />
          <Route path="/profile/investor" element={<InvestorProfile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/upgrade" element={<PremiumUpgrade />} />
          <Route path="/auth" element={<Auth />} />

          <Route path="/auth/facebook/callback" element={<FacebookCallbackPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
