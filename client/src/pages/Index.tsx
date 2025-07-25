
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

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <Hero />
      <RoleCards />
      <FeaturedTalents />
      <FeaturedJobs />
      <Footer />
    </div>
  );
};

export default Index;
