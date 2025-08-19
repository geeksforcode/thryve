import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';

// Temporary in-memory storage (replace with DB integration later)
const artists = new Map<string, any>();

@Injectable()
export class ArtistsService {
  findAll() {
    return Array.from(artists.values());
  }

  findOne(id: string) {
    const artist = artists.get(id);
    if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);
    return artist;
  }

  create(createArtistDto: CreateArtistDto) {
    const id = (Math.random() * 100000).toFixed(0);
    const newArtist = { id, ...createArtistDto };
    artists.set(id, newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    if (!artists.has(id)) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    const updatedArtist = { ...artists.get(id), ...updateArtistDto };
    artists.set(id, updatedArtist);
    return updatedArtist;
  }

  remove(id: string) {
    if (!artists.has(id)) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    const deleted = artists.get(id);
    artists.delete(id);
    return deleted;
  }
}
