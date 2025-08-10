import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface AddExperienceModalProps {
  onAdd?: (experience: any) => void
  triggerText?: string
  triggerVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
}

const AddExperienceModal = ({ onAdd, triggerText = "Add Experience", triggerVariant = "outline" }: AddExperienceModalProps) => {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const experience = {
      title: formData.get('title'),
      company: formData.get('company'),
      period: formData.get('period'),
      description: formData.get('description')
    }
    
    onAdd?.(experience)
    setOpen(false)
    toast({
      title: "Experience Added",
      description: "Your work experience has been added to your profile."
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Work Experience</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Job Title</Label>
            <Input id="title" name="title" placeholder="e.g. Senior Frontend Developer" required />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" placeholder="e.g. TechCorp Inc" required />
          </div>
          <div>
            <Label htmlFor="period">Period</Label>
            <Input id="period" name="period" placeholder="e.g. 2022 - Present" required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Describe your responsibilities and achievements..."
              className="min-h-20"
              required 
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:opacity-90">
              Add Experience
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddExperienceModal