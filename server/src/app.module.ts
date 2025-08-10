import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ArtistModule } from './artist/artist.module';
import { ContactService } from './contact/contact.service';
import { ContactModule } from './contact/contact.module';
import { UsersService } from './users/users.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ProfileModule,
    ArtistModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService, ContactService, UsersService],
})
export class AppModule {}
