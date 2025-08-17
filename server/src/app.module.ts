import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
// import { UsersModule } from './users/users.module';
import { InvestorsModule } from './users/investors/investors.module';
import { EmployeesModule } from './users/employees/employees.module';
import { EmployersModule } from './users/employers/employers.module';
import { ArtistsModule } from './users/artists/artists.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    InvestorsModule,
    EmployeesModule,
    EmployersModule,
    ArtistsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
