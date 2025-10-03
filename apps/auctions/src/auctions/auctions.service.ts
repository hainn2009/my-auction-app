import { CreateAuctionDto, isUser, Product, ProductDocument, UpdateAuctionDto } from '@app/contracts';
import { PlaceBidDto } from '@app/contracts/auctions/place-bid.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class AuctionsService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}
  async create({
    itemName,
    startingPrice,
    itemDescription,
    itemCategory,
    itemStartDate,
    itemEndDate,
    userId,
    file,
  }: CreateAuctionDto) {
    let imageUrl = '';

    if (file) {
      try {
        imageUrl = await this.cloudinaryService.uploadImage(file);
      } catch (error) {
        throw new RpcException({ message: 'Error uploading image to Cloudinary', error: error.message });
      }
    }

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
      itemPhoto: imageUrl,
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
    const product = await this.productModel.findById(id).populate('bids.bidder', 'name');
    if (!product) throw new NotFoundException('Auction not found');

    if (new Date(product.itemEndDate) < new Date()) throw new BadRequestException('Auction has already ended');

    const minBid = Math.max(product.currentPrice, product.startingPrice) + 1;
    const maxBid = Math.max(product.currentPrice, product.startingPrice) + 10;
    if (bidAmount < minBid) throw new BadRequestException(`Bid must be at least Rs ${minBid}`);
    if (bidAmount > maxBid) throw new BadRequestException(`Bid must be at max Rs ${maxBid}`);
    product.bids.push({
      bidder: new Types.ObjectId(userId),
      bidAmount: bidAmount,
    });

    product.currentPrice = bidAmount;
    await product.save();
    return 'Bid placed successfully';
  }
}
