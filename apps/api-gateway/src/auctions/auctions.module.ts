import { AuthModule } from '@app/contracts/auth/auth.module';
import { Module } from '@nestjs/common';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';

@Module({
  imports: [AuthModule],
  controllers: [AuctionsController],
  providers: [AuctionsService],
})
export class AuctionsModule {}
