import { Controller, Get } from '@nestjs/common';
import { AuctionAppService } from './auction-app.service';

@Controller()
export class AuctionAppController {
  constructor(private readonly auctionService: AuctionAppService) {}

  @Get('/health')
  getHealth(): string {
    return this.auctionService.getHealth();
  }
}
