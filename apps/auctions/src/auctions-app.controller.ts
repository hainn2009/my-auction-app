import { Controller, Get } from '@nestjs/common';
import { AuctionsAppService } from './auctions-app.service';

@Controller()
export class AuctionsAppController {
  constructor(private readonly auctionService: AuctionsAppService) {}

  @Get('/health')
  getHealth(): string {
    return this.auctionService.getHealth();
  }
}
