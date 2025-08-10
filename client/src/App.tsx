import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
