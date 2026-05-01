export class AnalyticsBidDto {
  bidderId: string;
  amount: number;
  bidTime?: Date;
}

export class AnalyticsAuctionDto {
  auctionId: string;
  itemName: string;
  itemCategory: string;
  startingPrice: number;
  currentPrice: number;
  itemStartDate: Date;
  itemEndDate: Date;
  sellerId: string;
  bids: AnalyticsBidDto[];
}
