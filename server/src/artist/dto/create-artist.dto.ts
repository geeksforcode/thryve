export class CreateArtistDto {
  name: string;
  bio?: string;
  skills: string[];
  rating?: number;
  userId: number;
}
