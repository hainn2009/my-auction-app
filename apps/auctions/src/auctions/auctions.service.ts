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
      seller: req.user.id,
    });
    await newAuction.save();

    return 'This action adds a new auction';
  }

  findAll() {
    return `This action returns all auctions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auction`;
  }

  update(id: number, updateAuctionDto: UpdateAuctionDto) {
    return `This action updates a #${id} auction`;
  }

  remove(id: number) {
    return `This action removes a #${id} auction`;
  }
}
