import { Module } from '@nestjs/common';
import { InvestorsController } from './investors.controller';
import { InvestorsService } from './investors.service';

@Module({
  controllers: [InvestorsController],
  providers: [InvestorsService]
})
export class InvestorsModule {}
