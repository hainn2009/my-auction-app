import { CreateAuctionDto, Product, ProductDocument, UpdateAuctionDto } from '@app/contracts';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  findAll() {
    return this.productModel.find().exec();
  }

  findOne(id: number) {
    return this.productModel.findById(id).exec();
  }

  update(updateAuctionDto: UpdateAuctionDto) {
    return `This action updates a auction`;
  }

  remove(id: number) {
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
      sellerName: auction.seller.name,
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
      sellerName: auction.seller.name,
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
      sellerName: auction.seller.name,
      itemPhoto: auction.itemPhoto,
    }));
    return formatted;
  }
}
