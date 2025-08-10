import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">T</span>
            </div>
            <span className="font-heading font-bold text-2xl text-foreground">Thryve</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/listings/jobs" className="text-muted-foreground hover:text-foreground transition-smooth">Jobs</a>
            <a href="/listings/job-seekers" className="text-muted-foreground hover:text-foreground transition-smooth">Talent</a>
            <a href="/listings/artists" className="text-muted-foreground hover:text-foreground transition-smooth">Artists</a>
            <a href="/listings/investors" className="text-muted-foreground hover:text-foreground transition-smooth">Investors</a>
            <a href="/upgrade" className="text-muted-foreground hover:text-foreground transition-smooth">Upgrade</a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
              <a href="/auth">Sign In</a>
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90 transition-smooth shadow-card" asChild>
              <a href="/auth">Get Started</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col space-y-4">
              <a href="/listings/jobs" className="text-muted-foreground hover:text-foreground transition-smooth">Jobs</a>
              <a href="/listings/job-seekers" className="text-muted-foreground hover:text-foreground transition-smooth">Talent</a>
              <a href="/listings/artists" className="text-muted-foreground hover:text-foreground transition-smooth">Artists</a>
              <a href="/listings/investors" className="text-muted-foreground hover:text-foreground transition-smooth">Investors</a>
              <a href="/upgrade" className="text-muted-foreground hover:text-foreground transition-smooth">Upgrade</a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost" className="justify-start" asChild>
                  <a href="/auth">Sign In</a>
                </Button>
                <Button className="bg-gradient-primary hover:opacity-90 transition-smooth shadow-card" asChild>
                  <a href="/auth">Get Started</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation