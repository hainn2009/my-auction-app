import { CreateAuctionResponseDto } from './create-auction-response.dto';

export class GetStatsResponseDto {
  totalAuctions: number;
  userAuctionCount: number;
  activeAuctions: number;
  latestAuctions: CreateAuctionResponseDto[];
  latestUserAuctions: CreateAuctionResponseDto[];
}
