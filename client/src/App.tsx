import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import OpportunityDetail from "./pages/OpportunityDetail";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import TalentDetail from "./pages/TalentDetail";
import NotFound from "./pages/NotFound";
import Profile from "./pages/profile/Profile";
import Dashboard from "./pages/profile/Dashboard";
import Portfolio from "./pages/profile/Portfolio";
import JoinUs from "./pages/profile/JoinUs";
import ProfileContact from "./pages/profile/ProfileContact";
import ProfilesList from "./pages/profile/ProfileList";
import ProfileHub from "./components/ProfileHUb";


const queryClient = new QueryClient();

const App = () => (
  <>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          {" "}
          {/* ✅ Now using HashRouter */}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/chat" element={<Chat/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />

            <Route path="/opportunity/:id" element={<OpportunityDetail />} />
            <Route path="/talent/:id" element={<TalentDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="profile/dashboard" element={<Dashboard />} />
            <Route path="profile/profilecontact" element={<ProfileContact />} />
            <Route path="profile/joinus" element={<JoinUs />} />
            <Route path="profiles" element={<ProfilesList />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/profile" element={<ProfileHub />} />

          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </>
);

export default App;
