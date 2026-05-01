import {
  AUCTIONS_PATTERN,
  AnalyticsAuctionDto,
  AnalyticsCategoryReportDto,
  AnalyticsHotAuctionDto,
  AnalyticsReportDto,
  CreateAuctionDto,
  CreateAuctionResponseDto,
  GetStatsResponseDto,
  UpdateAuctionDto,
} from '@app/contracts';
import { GetAuctionDto } from '@app/contracts/auctions/get-auction.dto';
import { PlaceBidDto } from '@app/contracts/auctions/place-bid.dto';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AUCTIONS_CLIENT } from '../constant';

@Injectable()
export class AuctionsService {
  private readonly logger = new Logger(AuctionsService.name);

  constructor(
    @Inject(AUCTIONS_CLIENT) private readonly auctionsClient: ClientProxy,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  create(createAuctionDto: CreateAuctionDto) {
    return firstValueFrom(
      this.auctionsClient.send<CreateAuctionResponseDto>(AUCTIONS_PATTERN.AUCTIONS.CREATE, createAuctionDto),
    );
  }

  findAll() {
    return firstValueFrom(this.auctionsClient.send<CreateAuctionResponseDto>(AUCTIONS_PATTERN.AUCTIONS.FIND_ALL, {}));
  }

  findOne(getAuctionDto: GetAuctionDto) {
    return firstValueFrom(
      this.auctionsClient.send<CreateAuctionResponseDto>(AUCTIONS_PATTERN.AUCTIONS.FIND_ONE, getAuctionDto),
    );
  }

  placeBid(placeBidDto: PlaceBidDto) {
    return firstValueFrom(this.auctionsClient.send<string>(AUCTIONS_PATTERN.AUCTIONS.PLACE_BID, placeBidDto));
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

  async getAnalyticsReport(): Promise<AnalyticsReportDto> {
    const reportData = await firstValueFrom(
      this.auctionsClient.send<AnalyticsAuctionDto[]>(AUCTIONS_PATTERN.AUCTIONS.REPORT_DATA, {}),
    );

    const aiServiceUrl = this.configService.get<string>('AI_SERVICE_URL', 'http://localhost:8000');
    try {
      const response = await firstValueFrom(
        this.httpService.post<AnalyticsReportDto>(
          `${aiServiceUrl}/analytics/summary`,
          {
            auctions: reportData,
            top_n: 5,
          },
          { timeout: 3000 },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.warn(
        `AI service unavailable at ${aiServiceUrl}, returning fallback analytics report`,
      );
      return this.buildFallbackAnalyticsReport(reportData);
    }
  }

  async getAnalyticsHealth(): Promise<{
    aiServiceUrl: string;
    status: 'healthy' | 'unhealthy';
    fallbackMode: boolean;
    latencyMs: number | null;
  }> {
    const aiServiceUrl = this.configService.get<string>('AI_SERVICE_URL', 'http://localhost:8000');
    const startedAt = Date.now();

    try {
      await firstValueFrom(this.httpService.get(`${aiServiceUrl}/health`, { timeout: 2000 }));
      return {
        aiServiceUrl,
        status: 'healthy',
        fallbackMode: false,
        latencyMs: Date.now() - startedAt,
      };
    } catch (error) {
      return {
        aiServiceUrl,
        status: 'unhealthy',
        fallbackMode: true,
        latencyMs: null,
      };
    }
  }

  private buildFallbackAnalyticsReport(auctions: AnalyticsAuctionDto[]): AnalyticsReportDto {
    const now = new Date();
    const totalAuctions = auctions.length;
    let activeAuctions = 0;
    let endedAuctions = 0;
    let upcomingAuctions = 0;
    let totalBids = 0;
    let totalStartPrice = 0;
    let totalCurrentPrice = 0;
    let totalPriceGrowth = 0;
    let totalPriceGrowthPct = 0;
    const bidHours: number[] = [];

    const categoryMap = new Map<
      string,
      {
        auctionCount: number;
        totalBids: number;
        totalPriceGrowth: number;
        totalPriceGrowthPct: number;
      }
    >();

    const hottestAuctions: AnalyticsHotAuctionDto[] = [];

    for (const auction of auctions) {
      const startDate = new Date(auction.itemStartDate);
      const endDate = new Date(auction.itemEndDate);
      if (startDate > now) {
        upcomingAuctions += 1;
      } else if (endDate < now) {
        endedAuctions += 1;
      } else {
        activeAuctions += 1;
      }

      const bidCount = auction.bids.length;
      totalBids += bidCount;
      totalStartPrice += auction.startingPrice;
      totalCurrentPrice += auction.currentPrice;

      const priceGrowth = auction.currentPrice - auction.startingPrice;
      const priceGrowthPct =
        auction.startingPrice > 0 ? (priceGrowth / auction.startingPrice) * 100 : 0;
      totalPriceGrowth += priceGrowth;
      totalPriceGrowthPct += priceGrowthPct;

      const durationMinutes = Math.max((endDate.getTime() - startDate.getTime()) / 60000, 1);
      const bidVelocityPerMinute = bidCount / durationMinutes;

      const category = categoryMap.get(auction.itemCategory) ?? {
        auctionCount: 0,
        totalBids: 0,
        totalPriceGrowth: 0,
        totalPriceGrowthPct: 0,
      };
      category.auctionCount += 1;
      category.totalBids += bidCount;
      category.totalPriceGrowth += priceGrowth;
      category.totalPriceGrowthPct += priceGrowthPct;
      categoryMap.set(auction.itemCategory, category);

      for (const bid of auction.bids) {
        if (bid.bidTime) {
          bidHours.push(new Date(bid.bidTime).getHours());
        }
      }

      hottestAuctions.push({
        auctionId: auction.auctionId,
        itemName: auction.itemName,
        itemCategory: auction.itemCategory,
        bidCount,
        priceGrowth: Math.round(priceGrowth * 100) / 100,
        priceGrowthPct: Math.round(priceGrowthPct * 100) / 100,
        bidVelocityPerMinute: Math.round(bidVelocityPerMinute * 10000) / 10000,
      });
    }

    const topCategories: AnalyticsCategoryReportDto[] = Array.from(categoryMap.entries()).map(
      ([itemCategory, category]) => ({
        itemCategory,
        auctionCount: category.auctionCount,
        totalBids: category.totalBids,
        averageBids: Math.round((category.totalBids / category.auctionCount) * 100) / 100,
        averagePriceGrowth:
          Math.round((category.totalPriceGrowth / category.auctionCount) * 100) / 100,
        averagePriceGrowthPct:
          Math.round((category.totalPriceGrowthPct / category.auctionCount) * 100) / 100,
      }),
    );

    const peakBidHour = this.getPeakBidHour(bidHours);

    return {
      generatedAt: now.toISOString(),
      totalAuctions,
      activeAuctions,
      endedAuctions,
      upcomingAuctions,
      totalBids,
      averageBidsPerAuction:
        totalAuctions > 0 ? Math.round((totalBids / totalAuctions) * 100) / 100 : 0,
      averageStartPrice:
        totalAuctions > 0 ? Math.round((totalStartPrice / totalAuctions) * 100) / 100 : 0,
      averageCurrentPrice:
        totalAuctions > 0 ? Math.round((totalCurrentPrice / totalAuctions) * 100) / 100 : 0,
      averagePriceGrowth:
        totalAuctions > 0 ? Math.round((totalPriceGrowth / totalAuctions) * 100) / 100 : 0,
      averagePriceGrowthPct:
        totalAuctions > 0 ? Math.round((totalPriceGrowthPct / totalAuctions) * 100) / 100 : 0,
      peakBidHour,
      topCategories: topCategories.sort((a, b) => b.auctionCount - a.auctionCount),
      hottestAuctions: hottestAuctions
        .sort((a, b) => b.bidCount - a.bidCount || b.priceGrowth - a.priceGrowth)
        .slice(0, 5),
    };
  }

  private getPeakBidHour(hours: number[]): number | undefined {
    if (hours.length === 0) return undefined;

    const counts = new Map<number, number>();
    for (const hour of hours) {
      counts.set(hour, (counts.get(hour) ?? 0) + 1);
    }

    let peakHour = hours[0];
    let peakCount = 0;
    for (const [hour, count] of counts.entries()) {
      if (count > peakCount) {
        peakHour = hour;
        peakCount = count;
      }
    }

    return peakHour;
  }
}
