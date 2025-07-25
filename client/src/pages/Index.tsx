
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Briefcase, Palette, Users, TrendingUp, ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import RoleCards from "@/components/RoleCards";
import FeaturedTalents from "@/components/FeaturedTalents";
import FeaturedJobs from "@/components/FeaturedJobs";
import Footer from "@/components/Footer";
import { User } from "lucide-react";


const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <Hero />
      <RoleCards />
      <FeaturedTalents />
      <FeaturedJobs />
       {/* Profile Page Button */}
      <div className="flex justify-center my-12">
        <Link to="/profile">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:scale-105 transition">
            <User className="mr-2 h-5 w-5" />
            🚀 Explore Profile Hub
          </Button>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
