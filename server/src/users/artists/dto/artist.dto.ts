export class CreateArtistDto {
  name!: string; // required
  specialty!: string; // required
  avatar?: string;
  location?: string;
  email?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  portfolio?: {
    id: number;
    title: string;
    image: string;
    description: string;
    likes: number;
    views: number;
    category: string;
  }[];
  experience?: {
    role: string;
    company: string;
    period: string;
    description: string;
  }[];
  stats?: {
    totalLikes: number;
    totalViews: number;
    followers: number;
    projects: number;
  };
}

export class UpdateArtistDto extends CreateArtistDto {}
