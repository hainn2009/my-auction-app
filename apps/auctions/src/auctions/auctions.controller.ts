import { AUCTIONS_PATTERN, CreateAuctionDto, UpdateAuctionDto } from '@app/contracts';
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
  findOne(@Payload() id: number) {
    return this.auctionsService.findOne(id);
  }

  @MessagePattern(AUCTIONS_PATTERN.AUCTIONS.UPDATE)
  update(@Payload() updateAuctionDto: UpdateAuctionDto) {
    return this.auctionsService.update(updateAuctionDto);
  }

  @MessagePattern(AUCTIONS_PATTERN.AUCTIONS.REMOVE)
  remove(@Payload() id: number) {
    return this.auctionsService.remove(id);
  }
}
