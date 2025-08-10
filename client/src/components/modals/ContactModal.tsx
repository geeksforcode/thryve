import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MessageCircle, Phone, User } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface ContactModalProps {
  recipientName: string
  recipientType: "artist" | "job-seeker" | "investor" | "employer"
  triggerText?: string
  triggerVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  triggerIcon?: React.ReactNode
}

const ContactModal = ({ 
  recipientName, 
  recipientType, 
  triggerText, 
  triggerVariant = "default",
  triggerIcon
}: ContactModalProps) => {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  
  const getDefaultSubject = () => {
    switch (recipientType) {
      case "artist":
        return "Project Collaboration Opportunity"
      case "job-seeker":
        return "Job Opportunity"
      case "investor":
        return "Investment Opportunity"
      case "employer":
        return "Partnership Opportunity"
      default:
        return "Let's Connect"
    }
  }

  const getDefaultMessage = () => {
    switch (recipientType) {
      case "artist":
        return `Hi ${recipientName},\n\nI came across your portfolio on Thryve and I'm impressed with your work. I'd love to discuss a potential collaboration opportunity.\n\nBest regards,`
      case "job-seeker":
        return `Hi ${recipientName},\n\nI found your profile on Thryve and I'm interested in discussing a potential job opportunity that might be a great fit for your skills.\n\nBest regards,`
      case "investor":
        return `Hi ${recipientName},\n\nI'm reaching out from Thryve regarding a potential investment opportunity that aligns with your portfolio.\n\nBest regards,`
      case "employer":
        return `Hi ${recipientName},\n\nI'm interested in exploring potential partnership opportunities between our organizations.\n\nBest regards,`
      default:
        return `Hi ${recipientName},\n\nI'd love to connect and explore potential opportunities.\n\nBest regards,`
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Simulate sending message
    toast({
      title: "Message Sent!",
      description: `Your message has been sent to ${recipientName}. They will receive it via their preferred contact method.`
    })
    
    setOpen(false)
  }

  const getButtonText = () => {
    if (triggerText) return triggerText
    
    switch (recipientType) {
      case "artist":
        return "Hire Me"
      case "job-seeker":
        return "Contact Me"
      case "investor":
        return "Connect"
      case "employer":
        return "Contact"
      default:
        return "Contact"
    }
  }

  const getButtonIcon = () => {
    if (triggerIcon) return triggerIcon
    
    switch (recipientType) {
      case "artist":
        return <MessageCircle className="h-4 w-4 mr-2" />
      case "job-seeker":
        return <Mail className="h-4 w-4 mr-2" />
      case "investor":
        return <User className="h-4 w-4 mr-2" />
      case "employer":
        return <Phone className="h-4 w-4 mr-2" />
      default:
        return <Mail className="h-4 w-4 mr-2" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} className={triggerVariant === "default" ? "bg-gradient-primary hover:opacity-90" : ""}>
          {getButtonIcon()}
          {getButtonText()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Contact {recipientName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" name="name" placeholder="Enter your full name" required />
          </div>
          
          <div>
            <Label htmlFor="email">Your Email</Label>
            <Input id="email" name="email" type="email" placeholder="your.email@example.com" required />
          </div>
          
          <div>
            <Label htmlFor="phone">Your Phone (optional)</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" />
          </div>
          
          <div>
            <Label htmlFor="urgency">Priority Level</Label>
            <Select name="urgency" defaultValue="medium">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - General Inquiry</SelectItem>
                <SelectItem value="medium">Medium - Business Opportunity</SelectItem>
                <SelectItem value="high">High - Urgent Project</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              name="subject" 
              defaultValue={getDefaultSubject()}
              placeholder="What's this about?"
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message" 
              name="message" 
              defaultValue={getDefaultMessage()}
              placeholder="Write your message here..."
              className="min-h-32"
              required 
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:opacity-90">
              Send Message
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ContactModal