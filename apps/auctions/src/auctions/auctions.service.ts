import {
  AUCTIONS_PATTERN,
  CreateAuctionDto,
  isUser,
  Product,
  ProductDocument,
  UpdateAuctionDto,
  User,
  UserDocument,
} from '@app/contracts';
import { PlaceBidDto } from '@app/contracts/auctions/place-bid.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import type { Cache } from 'cache-manager';
import { Model, Types } from 'mongoose';
import { AUCTIONS_WRITE_DB_CLIENT, GATEWAY_WEBSOCKET_CLIENT } from './constants';

@Injectable()
export class AuctionsService {
  private readonly logger = new Logger(AuctionsService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(AUCTIONS_WRITE_DB_CLIENT) private readonly amqpConnection: ClientProxy,
    @Inject(GATEWAY_WEBSOCKET_CLIENT) private readonly redisClient: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async create({
    itemName,
    startingPrice,
    itemDescription,
    itemCategory,
    itemStartDate,
    itemEndDate,
    userId,
    itemPhotoUrl,
  }: CreateAuctionDto) {
    const start = itemStartDate ? new Date(itemStartDate) : new Date();
    const end = new Date(itemEndDate);
    if (end <= start) {
      throw new RpcException({ message: 'Auction end date must be after start date' });
    }

    const newAuction = new this.productModel({
      itemName,
      startingPrice,
      currentPrice: startingPrice,
      itemDescription,
      itemCategory,
      itemPhoto: itemPhotoUrl,
      itemStartDate: start,
      itemEndDate: end,
      seller: userId,
    });
    await newAuction.save();

    return newAuction;
  }

  async findAll() {
    const auction = await this.productModel
      .find({ itemEndDate: { $gt: new Date() } })
      .populate('seller', 'name')
      .select('itemName itemDescription currentPrice bids itemEndDate itemCategory itemPhoto seller')
      .sort({ createdAt: -1 });
    const formatted = auction.map((auction) => ({
      _id: auction._id,
      itemName: auction.itemName,
      itemDescription: auction.itemDescription,
      currentPrice: auction.currentPrice,
      bidsCount: auction.bids.length,
      timeLeft: Math.max(0, auction.itemEndDate.getTime() - Date.now()),
      itemCategory: auction.itemCategory,
      sellerName: isUser(auction.seller) ? auction.seller.name : null,
      itemPhoto: auction.itemPhoto,
    }));

    return formatted;
  }

  async findOne(id: string) {
    const auction = await this.productModel.findById(id).populate('seller', 'name').populate('bids.bidder', 'name');
    if (!auction) return { success: false, error: { message: 'Auction not found' } };
    auction.bids.sort((a, b) => b.bidTime!.getTime() - a.bidTime!.getTime());
    return auction;
  }

  update(updateAuctionDto: UpdateAuctionDto) {
    return `This action updates a auction`;
  }

  remove(id: string) {
    return `This action removes a #${id} auction`;
  }

  async getStats(userId: string) {
    const dateNow = new Date();
    const stats = await this.productModel.aggregate([
      {
        $facet: {
          totalAuctions: [{ $count: 'count' }],
          userAuctionCount: [{ $match: { seller: userId } }, { $count: 'count' }],
          activeAuctions: [
            { $match: { itemStartDate: { $lte: dateNow }, itemEndDate: { $gte: dateNow } } },
            { $count: 'count' },
          ],
        },
      },
    ]);

    const totalAuctions = stats[0].totalAuctions[0]?.count || 0;
    const userAuctionCount = stats[0].userAuctionCount[0]?.count || 0;
    const activeAuctions = stats[0].activeAuctions[0]?.count || 0;

    const globalAuction = await this.productModel
      .find({ itemEndDate: { $gt: dateNow } })
      .populate('seller', 'name')
      .sort({ createdAt: -1 })
      .limit(3);
    const latestAuctions = globalAuction.map((auction) => ({
      _id: auction._id,
      itemName: auction.itemName,
      itemDescription: auction.itemDescription,
      currentPrice: auction.currentPrice,
      bidsCount: auction.bids.length,
      timeLeft: Math.max(0, auction.itemEndDate.getTime() - Date.now()),
      itemCategory: auction.itemCategory,
      sellerName: isUser(auction.seller) ? auction.seller.name : null,
      itemPhoto: auction.itemPhoto,
    }));

    const userAuction = await this.productModel
      .find({ seller: userId })
      .populate('seller', 'name')
      .sort({ createdAt: -1 })
      .limit(3);
    const latestUserAuctions = userAuction.map((auction) => ({
      _id: auction._id,
      itemName: auction.itemName,
      itemDescription: auction.itemDescription,
      currentPrice: auction.currentPrice,
      bidsCount: auction.bids.length,
      timeLeft: Math.max(0, auction.itemEndDate.getTime() - Date.now()),
      itemCategory: auction.itemCategory,
      sellerName: isUser(auction.seller) ? auction.seller.name : null,
      itemPhoto: auction.itemPhoto,
    }));

    return { totalAuctions, userAuctionCount, activeAuctions, latestAuctions, latestUserAuctions };
  }

  async getMyAuctions(userId: string) {
    const auction = await this.productModel
      .find({ seller: userId })
      .populate('seller', 'name')
      .select('itemName itemDescription currentPrice bids itemEndDate itemCategory itemPhoto seller')
      .sort({ createdAt: -1 });
    const formatted = auction.map((auction) => ({
      _id: auction._id,
      itemName: auction.itemName,
      itemDescription: auction.itemDescription,
      currentPrice: auction.currentPrice,
      bidsCount: auction.bids.length,
      timeLeft: Math.max(0, auction.itemEndDate.getTime() - Date.now()),
      itemCategory: auction.itemCategory,
      sellerName: isUser(auction.seller) ? auction.seller.name : null,
      itemPhoto: auction.itemPhoto,
    }));
    return formatted;
  }

  async placeBid({ userId, auctionId: id, bidAmount }: PlaceBidDto) {
    // Get product from cache to reduce DB hits
    const cacheKey = `auction:${id}`;
    let product: any;
    const cached = (await this.cacheManager.get(cacheKey)) as string;

    if (cached) {
      product = JSON.parse(cached);
    } else {
      product = await this.productModel.findById(id).populate('bids.bidder', 'name').lean();
      // product = await this.productModel.findById(id).lean();
      if (!product) return { success: false, errorCode: 'NOT_FOUND', message: 'Auction not found' };
      await this.cacheManager.set(cacheKey, JSON.stringify(product));
    }

    // Validate bid
    if (new Date(product.itemEndDate) < new Date())
      return { success: false, errorCode: 'AUCTION_ENDED', message: 'Auction has already ended' };

    const minBid = Math.max(product.currentPrice, product.startingPrice) + 1;
    const maxBid = Math.max(product.currentPrice, product.startingPrice) + 10;
    if (bidAmount < minBid)
      return { success: false, errorCode: 'BID_TOO_LOW', message: `Bid must be at least ${minBid}` };
    if (bidAmount > maxBid)
      return { success: false, errorCode: 'BID_TOO_HIGH', message: `Bid must be at max ${maxBid}` };

    // Save bid temporarily in cache and persist to DB
    product.bids.push({
      bidder: new Types.ObjectId(userId),
      bidAmount: bidAmount,
    });
    product.currentPrice = bidAmount;

    // Create event in Redis PubSub for real-time updates
    const bidUser = await this.userModel.findById(userId).lean();
    if (!bidUser) return { success: false, errorCode: 'USER_NOT_FOUND', message: 'User not found' };
    const pubsubPayload = {
      ...product,
      // auctionId: id,
      // currentPrice: product.currentPrice,
      bidder: { _id: userId, name: bidUser.name },
      // bidAmount,
      // timestamp: Date.now(),
    };
    await this.redisClient.emit(AUCTIONS_PATTERN.BIDS.BROAD_CAST_BID_RESULT, pubsubPayload);

    // Actually save bid to DB in queue-2
    await this.amqpConnection.emit(AUCTIONS_PATTERN.AUCTIONS.WRITE_DB, product);

    // Return result to queue-1 (gateway)
    this.logger.log(`Bid cached & published for auction ${id} (user ${userId})`);
    return { success: true, message: 'Bid accepted (cached)', data: product };
  }
}
