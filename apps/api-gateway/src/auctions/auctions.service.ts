import {
  AUCTIONS_PATTERN,
  CreateAuctionDto,
  CreateAuctionResponseDto,
  GetStatsResponseDto,
  UpdateAuctionDto,
} from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { AUCTIONS_CLIENT } from '../constant';

@Injectable()
export class AuctionsService {
  constructor(@Inject(AUCTIONS_CLIENT) private readonly auctionsClient: ClientProxy) {}
  create(createAuctionDto: CreateAuctionDto) {
    return firstValueFrom(
      this.auctionsClient.send<CreateAuctionResponseDto>(AUCTIONS_PATTERN.AUCTIONS.CREATE, createAuctionDto),
    );
  }

  findAll() {
    return firstValueFrom(this.auctionsClient.send<CreateAuctionResponseDto>(AUCTIONS_PATTERN.AUCTIONS.FIND_ALL, {}));
  }

  findOne(id: string) {
    return firstValueFrom(this.auctionsClient.send<CreateAuctionResponseDto>(AUCTIONS_PATTERN.AUCTIONS.FIND_ONE, id));
  }

  update(updateAuctionDto: UpdateAuctionDto) {
    return `This action updates a auction`;
  }

  remove(id: number) {
    return `This action removes a #${id} auction`;
  }

  getStats(userId: string) {
    return this.auctionsClient.send<GetStatsResponseDto>(AUCTIONS_PATTERN.AUCTIONS.STATS, { userId });
  }

  getMyAuctions(userId: string) {
    return this.auctionsClient.send<any>(AUCTIONS_PATTERN.AUCTIONS.MY_AUCTIONS, { userId });
  }
}
