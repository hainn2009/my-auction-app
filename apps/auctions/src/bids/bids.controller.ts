import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';

@Controller()
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @MessagePattern('createBid')
  create(@Payload() createBidDto: CreateBidDto) {
    return this.bidsService.create(createBidDto);
  }

  @MessagePattern('findAllBids')
  findAll() {
    return this.bidsService.findAll();
  }

  @MessagePattern('findOneBid')
  findOne(@Payload() id: number) {
    return this.bidsService.findOne(id);
  }

  // @MessagePattern('updateBid')
  // update(@Payload() updateBidDto: UpdateBidDto) {
  //   return this.bidsService.update(updateBidDto.id, updateBidDto);
  // }

  @MessagePattern('removeBid')
  remove(@Payload() id: number) {
    return this.bidsService.remove(id);
  }
}
