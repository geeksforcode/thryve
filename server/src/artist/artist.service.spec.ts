import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../db/client';
import { artist } from '../db/schema';
import { eq } from 'drizzle-orm';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
  async create(data: CreateArtistDto) {
    const [newArtist] = await db.insert(artist).values(data).returning();
    return newArtist;
  }

  async findAll() {
    return db.select().from(artist);
  }

  async findOne(id: number) {
    const [result] = await db.select().from(artist).where(eq(artist.id, id));
    if (!result) throw new NotFoundException('Artist not found');
    return result;
  }

  async update(id: number, data: UpdateArtistDto) {
    const [updated] = await db
      .update(artist)
      .set(data)
      .where(eq(artist.id, id))
      .returning();
    if (!updated) throw new NotFoundException('Artist not found');
    return updated;
  }

  async remove(id: number) {
    const [deleted] = await db
      .delete(artist)
      .where(eq(artist.id, id))
      .returning();
    if (!deleted) throw new NotFoundException('Artist not found');
    return deleted;
  }
}
