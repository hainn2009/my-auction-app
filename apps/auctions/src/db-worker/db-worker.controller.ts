import { AUCTIONS_PATTERN } from '@app/contracts';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateBidDto } from '../bids/dto/create-bid.dto';
import { DbWorkerService } from './db-worker.service';

@Controller()
export class DbWorkerController {
  constructor(private readonly dbWorkerService: DbWorkerService) {}

  @MessagePattern(AUCTIONS_PATTERN.AUCTIONS.WRITE_DB)
  writeDB(@Payload() createBidDto: CreateBidDto) {
    return this.dbWorkerService.writeDB(createBidDto);
  }
}
