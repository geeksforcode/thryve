import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Mail,
  Phone,
  Edit,
  Plus,
  Heart,
  Eye,
  ExternalLink,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getArtist } from "@/services/apiClient";

const ArtistProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const [artistProfile, setArtistProfile] = useState([]);

  const fetchProfile = async () => {
    try {
      if (!id) throw new Error(`Artist${id} not found`);
      const data = await getArtist(+id);
      setArtistProfile(data);
      console.log(data);
    } catch (err) {
      console.log("shoot");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  // Mock profile data
  const profile = {
    name: "Elena Vasquez",
    specialty: "Digital Illustration & Character Design",
    avatar: "/placeholder.svg",
    location: "Los Angeles, CA",
    email: "elena.vasquez@email.com",
    phone: "+1 (555) 987-6543",
    bio: "Digital artist with 6+ years of experience specializing in character design, concept art, and illustration for games, animation, and publishing. I love bringing stories to life through compelling visual narratives.",
    skills: [
      "Digital Illustration",
      "Character Design",
      "Concept Art",
      "Photoshop",
      "Procreate",
      "Blender",
      "Animation",
      "Storyboarding",
    ],
    portfolio: [
      {
        id: 1,
        title: "Fantasy Character Series",
        image: "/placeholder.svg",
        description:
          "A collection of fantasy characters for an indie game project",
        likes: 245,
        views: 1240,
        category: "Character Design",
      },
      {
        id: 2,
        title: "Environmental Concept Art",
        image: "/placeholder.svg",
        description: "Concept art for various game environments and settings",
        likes: 189,
        views: 890,
        category: "Concept Art",
      },
      {
        id: 3,
        title: "Book Cover Illustrations",
        image: "/placeholder.svg",
        description: "Cover artwork for fantasy and sci-fi novels",
        likes: 312,
        views: 1560,
        category: "Illustration",
      },
      {
        id: 4,
        title: "Animation Sequences",
        image: "/placeholder.svg",
        description: "2D animation work for short films and commercials",
        likes: 167,
        views: 720,
        category: "Animation",
      },
      {
        id: 5,
        title: "Logo & Brand Design",
        image: "/placeholder.svg",
        description: "Brand identity work for creative studios",
        likes: 98,
        views: 450,
        category: "Branding",
      },
      {
        id: 6,
        title: "Digital Portraits",
        image: "/placeholder.svg",
        description: "Portrait commissions in various digital styles",
        likes: 203,
        views: 980,
        category: "Portrait",
      },
    ],
    experience: [
      {
        role: "Lead Character Artist",
        company: "Pixel Dreams Studio",
        period: "2022 - Present",
        description:
          "Leading character design for mobile games, managing art direction and mentoring junior artists.",
      },
      {
        role: "Freelance Illustrator",
        company: "Independent",
        period: "2020 - 2022",
        description:
          "Worked with various clients on book covers, game assets, and commercial illustration projects.",
      },
      {
        role: "Concept Artist",
        company: "GameCraft Studios",
        period: "2018 - 2020",
        description:
          "Created concept art and visual development for multiple game titles.",
      },
    ],
    stats: {
      totalLikes: 1450,
      totalViews: 8920,
      followers: 3240,
      projects: 24,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Profile Header */}
          <Card className="shadow-card mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-6">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="text-2xl">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-4">
                    <div>
                      <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                        {profile.name}
                      </h1>
                      <p className="text-xl text-primary font-medium mb-3">
                        {profile.specialty}
                      </p>

                      <div className="flex items-center space-x-6 text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {profile.location}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {profile.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {profile.phone}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-8 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-foreground">
                          {profile.stats.followers}
                        </div>
                        <div className="text-muted-foreground">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">
                          {profile.stats.totalLikes}
                        </div>
                        <div className="text-muted-foreground">Total Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">
                          {profile.stats.totalViews}
                        </div>
                        <div className="text-muted-foreground">Total Views</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">
                          {profile.stats.projects}
                        </div>
                        <div className="text-muted-foreground">Projects</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                  <Button className="bg-gradient-primary hover:opacity-90">
                    Hire Me
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Bio */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-lg font-heading font-semibold text-foreground">
                    About
                  </h2>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      defaultValue={profile.bio}
                      className="min-h-32"
                      placeholder="Tell us about your artistic journey..."
                    />
                  ) : (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {profile.bio}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-lg font-heading font-semibold text-foreground">
                    Skills
                  </h2>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-lg font-heading font-semibold text-foreground">
                    Experience
                  </h2>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-primary pl-3">
                      <h4 className="font-medium text-foreground text-sm">
                        {exp.role}
                      </h4>
                      <p className="text-primary text-sm font-medium">
                        {exp.company}
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        {exp.period}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Contact */}
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-lg font-heading font-semibold text-foreground">
                    Contact
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="email" className="text-xs">
                          Email
                        </Label>
                        <Input
                          id="email"
                          defaultValue={profile.email}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-xs">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          defaultValue={profile.phone}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location" className="text-xs">
                          Location
                        </Label>
                        <Input
                          id="location"
                          defaultValue={profile.location}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <Button className="w-full bg-gradient-primary hover:opacity-90">
                      Contact Artist
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Portfolio */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading font-bold text-foreground">
                  Portfolio
                </h2>
                {isEditing && (
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Artwork
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.portfolio.map((item) => (
                  <Card
                    key={item.id}
                    className="shadow-card hover:shadow-card-hover transition-smooth overflow-hidden group"
                  >
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-background/90"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Full
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-foreground text-sm line-clamp-1">
                          {item.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs ml-2 shrink-0"
                        >
                          {item.category}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Heart className="h-3 w-3 mr-1" />
                            {item.likes}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {item.views}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Artwork
                </Button>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button
                className="bg-gradient-primary hover:opacity-90"
                onClick={() => setIsEditing(false)}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ArtistProfile;
