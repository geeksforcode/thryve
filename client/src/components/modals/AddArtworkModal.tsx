import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Upload } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface AddArtworkModalProps {
  onAdd?: (artwork: any) => void
  triggerText?: string
  triggerVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
}

const categories = [
  "Character Design",
  "Concept Art", 
  "Illustration",
  "Animation",
  "Branding",
  "Portrait",
  "Digital Art",
  "Traditional Art",
  "3D Art",
  "Photography"
]

const AddArtworkModal = ({ onAdd, triggerText = "Add Artwork", triggerVariant = "outline" }: AddArtworkModalProps) => {
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const artwork = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      image: selectedFile ? URL.createObjectURL(selectedFile) : "/placeholder.svg",
      likes: 0,
      views: 0
    }
    
    onAdd?.(artwork)
    setOpen(false)
    setSelectedFile(null)
    toast({
      title: "Artwork Added",
      description: "Your artwork has been added to your portfolio."
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant}>
          <Plus className="h-4 w-4 mr-2" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Artwork to Portfolio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Artwork Title</Label>
            <Input id="title" name="title" placeholder="e.g. Fantasy Character Design" required />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Describe your artwork..."
              className="min-h-20"
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="image">Upload Image</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="image" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {selectedFile ? selectedFile.name : "Click to upload image"}
                </p>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:opacity-90">
              Add Artwork
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddArtworkModal