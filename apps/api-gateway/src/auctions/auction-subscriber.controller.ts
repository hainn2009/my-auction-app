import { AUCTIONS_PATTERN } from '@app/contracts';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AuctionsGateway } from './auctions.gateway';

@Controller()
export class AuctionSubscriberController {
  constructor(private readonly auctionsGateway: AuctionsGateway) {}
  // Get data from redis and send to client
  @EventPattern(AUCTIONS_PATTERN.BIDS.BROAD_CAST_BID_RESULT)
  handleBid(@Payload() data: any): void {
    const { _id, currentPrice, bidder } = data;
    console.log(`Bid placed for auction ${_id}: ${currentPrice} by ${bidder.name}`);
    this.auctionsGateway.server.emit('auction_updated', data);
  }
}
