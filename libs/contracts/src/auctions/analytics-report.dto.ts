export class AnalyticsCategoryReportDto {
  itemCategory: string;
  auctionCount: number;
  totalBids: number;
  averageBids: number;
  averagePriceGrowth: number;
  averagePriceGrowthPct: number;
}

export class AnalyticsHotAuctionDto {
  auctionId: string;
  itemName: string;
  itemCategory: string;
  bidCount: number;
  priceGrowth: number;
  priceGrowthPct: number;
  bidVelocityPerMinute: number;
}

export class AnalyticsReportDto {
  generatedAt: string;
  totalAuctions: number;
  activeAuctions: number;
  endedAuctions: number;
  upcomingAuctions: number;
  totalBids: number;
  averageBidsPerAuction: number;
  averageStartPrice: number;
  averageCurrentPrice: number;
  averagePriceGrowth: number;
  averagePriceGrowthPct: number;
  peakBidHour?: number;
  topCategories: AnalyticsCategoryReportDto[];
  hottestAuctions: AnalyticsHotAuctionDto[];
}
