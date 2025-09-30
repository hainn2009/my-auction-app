import { Product, ProductSchema } from '@app/contracts';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  controllers: [AuctionsController],
  providers: [AuctionsService, CloudinaryService],
})
export class AuctionsModule {}
