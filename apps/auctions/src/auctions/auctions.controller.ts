import { AUCTIONS_PATTERN, CreateAuctionDto, GetStatsDto, UpdateAuctionDto } from '@app/contracts';
import { GetAuctionDto } from '@app/contracts/auctions/get-auction.dto';
import { PlaceBidDto } from '@app/contracts/auctions/place-bid.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuctionsService } from './auctions.service';

@Controller()
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @MessagePattern(AUCTIONS_PATTERN.AUCTIONS.CREATE)
  create(@Payload() createAuctionDto: CreateAuctionDto) {
    return this.auctionsService.create(createAuctionDto);
  }

  @MessagePattern(AUCTIONS_PATTERN.AUCTIONS.FIND_ALL)
  findAll() {
    return this.auctionsService.findAll();
  }

  @MessagePattern(AUCTIONS_PATTERN.AUCTIONS.FIND_ONE)
  findOne(@Payload() { id }: GetAuctionDto) {
    return this.auctionsService.findOne(id);
  }

  @MessagePattern(AUCTIONS_PATTERN.AUCTIONS.UPDATE)
  update(@Payload() updateAuctionDto: UpdateAuctionDto) {
    return this.auctionsService.update(updateAuctionDto);
  }

  @MessagePattern(AUCTIONS_PATTERN.AUCTIONS.REMOVE)
  remove(@Payload() id: string) {
    return this.auctionsService.remove(id);
  }

  @MessagePattern(AUCTIONS_PATTERN.AUCTIONS.STATS)
  getStats(@Payload() { userId }: GetStatsDto) {
    return this.auctionsService.getStats(userId);
  }

  @MessagePattern(AUCTIONS_PATTERN.AUCTIONS.MY_AUCTIONS)
  getMyAuctions(@Payload() { userId }: GetStatsDto) {
    return this.auctionsService.getMyAuctions(userId);
  }

  @MessagePattern(AUCTIONS_PATTERN.AUCTIONS.PLACE_BID)
  placeBId(@Payload() placeBidDto: PlaceBidDto) {
    return this.auctionsService.placeBid(placeBidDto);
  }
}
