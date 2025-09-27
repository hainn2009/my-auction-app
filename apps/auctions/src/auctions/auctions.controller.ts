import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateAuctionDto } from '../../../../libs/contracts/src/auctions/create-auction.dto';
import { UpdateAuctionDto } from '../../../../libs/contracts/src/auctions/update-auction.dto';
import { AuctionsService } from './auctions.service';

@Controller()
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @MessagePattern('createAuction')
  create(@Payload() createAuctionDto: CreateAuctionDto) {
    return this.auctionsService.create(createAuctionDto);
  }

  @MessagePattern('findAllAuctions')
  findAll() {
    return this.auctionsService.findAll();
  }

  @MessagePattern('findOneAuction')
  findOne(@Payload() id: number) {
    return this.auctionsService.findOne(id);
  }

  @MessagePattern('updateAuction')
  update(@Payload() updateAuctionDto: UpdateAuctionDto) {
    return this.auctionsService.update(updateAuctionDto.id, updateAuctionDto);
  }

  @MessagePattern('removeAuction')
  remove(@Payload() id: number) {
    return this.auctionsService.remove(id);
  }
}
