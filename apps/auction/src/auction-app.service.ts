import { Injectable } from '@nestjs/common';

@Injectable()
export class AuctionAppService {
  getHello(): string {
    return 'Hello World!';
  }
}
