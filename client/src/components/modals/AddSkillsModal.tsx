import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, X } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface AddSkillsModalProps {
  onAdd?: (skills: string[]) => void
  currentSkills?: string[]
  triggerText?: string
  triggerVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  triggerIcon?: React.ReactNode
}

const AddSkillsModal = ({ 
  onAdd, 
  currentSkills = [], 
  triggerText = "Edit Skills", 
  triggerVariant = "outline",
  triggerIcon = <Edit className="h-4 w-4" />
}: AddSkillsModalProps) => {
  const [open, setOpen] = useState(false)
  const [skills, setSkills] = useState<string[]>(currentSkills)
  const [newSkill, setNewSkill] = useState("")
  const { toast } = useToast()

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleSave = () => {
    onAdd?.(skills)
    setOpen(false)
    toast({
      title: "Skills Updated",
      description: "Your skills have been updated successfully."
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size="sm">
          {triggerIcon}
          {triggerText && <span className="ml-2">{triggerText}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Skills</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="skill">Add New Skill</Label>
            <div className="flex space-x-2">
              <Input 
                id="skill" 
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g. React, TypeScript, Photoshop"
              />
              <Button onClick={addSkill} disabled={!newSkill.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label>Current Skills</Label>
            <div className="flex flex-wrap gap-2 mt-2 min-h-[60px] p-3 border rounded-md">
              {skills.length === 0 ? (
                <span className="text-muted-foreground text-sm">No skills added yet</span>
              ) : (
                skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="group">
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90">
              Save Skills
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddSkillsModal