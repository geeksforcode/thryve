import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface AddProjectModalProps {
  onAdd?: (project: any) => void
  triggerText?: string
  triggerVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
}

const AddProjectModal = ({ onAdd, triggerText = "Add Project", triggerVariant = "outline" }: AddProjectModalProps) => {
  const [open, setOpen] = useState(false)
  const [technologies, setTechnologies] = useState<string[]>([])
  const [newTech, setNewTech] = useState("")
  const { toast } = useToast()
  
  const addTechnology = () => {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      setTechnologies([...technologies, newTech.trim()])
      setNewTech("")
    }
  }

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const project = {
      name: formData.get('name'),
      description: formData.get('description'),
      link: formData.get('link'),
      tech: technologies
    }
    
    onAdd?.(project)
    setOpen(false)
    setTechnologies([])
    toast({
      title: "Project Added",
      description: "Your project has been added to your profile."
    })
  }

  const handleTechKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTechnology()
    }
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
          <DialogTitle>Add Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" name="name" placeholder="e.g. E-commerce Platform" required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Describe your project..."
              className="min-h-20"
              required 
            />
          </div>
          <div>
            <Label htmlFor="link">Project Link (optional)</Label>
            <Input id="link" name="link" placeholder="https://github.com/username/project" type="url" />
          </div>
          
          <div>
            <Label htmlFor="tech">Technologies Used</Label>
            <div className="flex space-x-2 mb-2">
              <Input 
                id="tech" 
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyPress={handleTechKeyPress}
                placeholder="e.g. React, Node.js"
              />
              <Button type="button" onClick={addTechnology} disabled={!newTech.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span 
                  key={tech} 
                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs cursor-pointer"
                  onClick={() => removeTechnology(tech)}
                >
                  {tech} ×
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:opacity-90">
              Add Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddProjectModal