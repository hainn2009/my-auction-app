import { Injectable } from '@nestjs/common';

@Injectable()
export class AuctionAppService {
  getHealth(): string {
    return 'App is running!';
  }
}
