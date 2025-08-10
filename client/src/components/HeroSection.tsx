import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import heroBackground from "@/assets/hero-background.jpg"

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBackground}
          alt="Professionals, artists, and business people collaborating"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/75 to-primary-dark/85"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="hero-text font-heading font-bold text-5xl md:text-7xl lg:text-8xl text-primary-foreground mb-6 leading-tight">
            Thryve
          </h1>
          
          {/* Tagline */}
          <p className="hero-text text-xl md:text-2xl lg:text-3xl text-primary-foreground/90 mb-8 font-medium">
            Where Talent Meets Opportunity
          </p>

          {/* Description */}
          <p className="hero-text text-lg md:text-xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect Job Seekers, Artists, Investors, and Employers in one powerful ecosystem. 
            Discover opportunities that drive success and talent that creates the future.
          </p>

          {/* CTA Buttons */}
          <div className="hero-button flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-background text-primary hover:bg-background/90 shadow-hero px-8 py-6 text-lg font-semibold transition-bounce hover:scale-105"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg"
              className="text-primary-foreground border-2 border-primary-foreground/30 hover:bg-primary-foreground/10 px-8 py-6 text-lg font-semibold transition-bounce hover:scale-105"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats or Trust Indicators */}
          <div className="hero-button mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="font-bold text-2xl md:text-3xl text-primary-foreground">10K+</div>
              <div className="text-primary-foreground/70 text-sm">Job Seekers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl md:text-3xl text-primary-foreground">5K+</div>
              <div className="text-primary-foreground/70 text-sm">Artists</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl md:text-3xl text-primary-foreground">2K+</div>
              <div className="text-primary-foreground/70 text-sm">Investors</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl md:text-3xl text-primary-foreground">1K+</div>
              <div className="text-primary-foreground/70 text-sm">Employers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection