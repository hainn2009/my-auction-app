import { Module } from '@nestjs/common';
import { AuctionsAppController } from './auctions-app.controller';
import { AuctionsAppService } from './auctions-app.service';
import { AuctionsModule } from './auctions/auctions.module';
import { BidsModule } from './bids/bids.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [AuctionsModule, ItemsModule, BidsModule],
  controllers: [AuctionsAppController],
  providers: [AuctionsAppService],
})
export class AuctionsAppModule {}
