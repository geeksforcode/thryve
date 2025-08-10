import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="font-heading font-bold text-2xl">Thryve</span>
            </div>
            <p className="text-background/70 leading-relaxed">
              Where Talent Meets Opportunity. Connecting Job Seekers, Artists, Investors, 
              and Employers in one powerful ecosystem.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-background/70 hover:text-background hover:bg-background/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background/70 hover:text-background hover:bg-background/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background/70 hover:text-background hover:bg-background/10">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background/70 hover:text-background hover:bg-background/10">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/70 hover:text-background transition-smooth">Job Listings</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-smooth">Artist Portfolios</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-smooth">Investment Opportunities</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-smooth">Employer Dashboard</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-smooth">Premium Features</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/70 hover:text-background transition-smooth">Help Center</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-smooth">Community Guidelines</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-smooth">Safety & Trust</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-smooth">Contact Us</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-smooth">API Documentation</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-background/70 mb-4">
              Get the latest opportunities and platform updates delivered to your inbox.
            </p>
            <div className="space-y-3">
              <Input 
                placeholder="Enter your email" 
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
              />
              <Button className="w-full bg-gradient-primary hover:opacity-90 transition-smooth">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-background/70 text-sm">
              © 2024 Thryve. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-background/70 hover:text-background transition-smooth">Privacy Policy</a>
              <a href="#" className="text-background/70 hover:text-background transition-smooth">Terms of Service</a>
              <a href="#" className="text-background/70 hover:text-background transition-smooth">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer