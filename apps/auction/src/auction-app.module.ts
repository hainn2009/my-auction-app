import { Module } from '@nestjs/common';
import { AuctionAppController } from './auction-app.controller';
import { AuctionAppService } from './auction-app.service';

@Module({
  imports: [],
  controllers: [AuctionAppController],
  providers: [AuctionAppService],
})
export class AuctionAppModule {}
