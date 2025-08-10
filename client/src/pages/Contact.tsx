import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle } from "lucide-react"
import Navigation from "@/components/Navigation"
import { useToast } from "@/hooks/use-toast"

const Contact = () => {
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours."
    })
  }

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      value: "hello@thryve.com",
      description: "Send us an email anytime"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 5pm"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Office",
      value: "San Francisco, CA",
      description: "123 Innovation Street"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Response Time",
      value: "< 24 hours",
      description: "We respond quickly"
    }
  ]

  const faqs = [
    {
      question: "How do I create a profile?",
      answer: "Click on 'Get Started' and select your role. Follow the steps to complete your profile setup."
    },
    {
      question: "Is Thryve free to use?",
      answer: "Yes! We offer a free tier with essential features. Premium plans unlock additional benefits and visibility."
    },
    {
      question: "How do I upgrade to premium?",
      answer: "Visit the 'Upgrade' page in your account settings to view premium plans and benefits."
    },
    {
      question: "Can I change my role type?",
      answer: "Yes, you can update your role type in your profile settings or create additional profiles for different roles."
    },
    {
      question: "How do I get more visibility?",
      answer: "Complete your profile, add portfolio items, get reviews, and consider upgrading to premium for enhanced visibility."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-2xl font-heading font-semibold text-foreground flex items-center">
                    <MessageCircle className="h-6 w-6 mr-3 text-primary" />
                    Send us a message
                  </h2>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" required />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" required />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">I'm a...</Label>
                      <Select name="subject" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="job-seeker">Job Seeker</SelectItem>
                          <SelectItem value="artist">Artist</SelectItem>
                          <SelectItem value="investor">Investor</SelectItem>
                          <SelectItem value="employer">Employer</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="topic">What can we help you with?</Label>
                      <Select name="topic" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="account">Account & Profile</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing & Payments</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        placeholder="Tell us more about how we can help you..."
                        className="min-h-32"
                        required 
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info & FAQ */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-xl font-heading font-semibold text-foreground">Contact Information</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="text-primary mt-1">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{info.title}</h3>
                        <p className="font-medium text-primary">{info.value}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-xl font-heading font-semibold text-foreground flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                    Frequently Asked Questions
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="font-medium text-foreground text-sm">{faq.question}</h3>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      {index < faqs.length - 1 && <hr className="border-border" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Contact