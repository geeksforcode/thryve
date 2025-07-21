import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistsController } from './artist.controller';
import { db } from '../db/client';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistService, { provide: 'DATABASE', useValue: db }],
})
export class ArtistModule {}
