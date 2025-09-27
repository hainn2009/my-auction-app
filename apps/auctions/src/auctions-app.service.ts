import { Injectable } from '@nestjs/common';

@Injectable()
export class AuctionsAppService {
  getHealth(): string {
    return 'App is running!';
  }
}
