import { Product, ProductDocument } from '@app/contracts';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBidDto } from '../bids/dto/create-bid.dto';

@Injectable()
export class DbWorkerService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async writeDB(createBidDto: CreateBidDto): Promise<void> {
    let product;
    if (!createBidDto._id) {
      product = new this.productModel(createBidDto);
    } else {
      product = await this.productModel.findByIdAndUpdate(createBidDto._id, createBidDto);
    }

    product.save();
  }
}
