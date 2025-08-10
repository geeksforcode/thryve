import Navigation from "@/components/Navigation"
import HeroSection from "@/components/HeroSection"
import RoleSelection from "@/components/RoleSelection"
import FeaturesSection from "@/components/FeaturesSection"
import Footer from "@/components/Footer"

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <RoleSelection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
