// product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BidDocument = HydratedDocument<Bid>;
@Schema({ _id: false })
export class Bid {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  bidder: Types.ObjectId;

  @Prop({ type: Number, required: true })
  bidAmount: number;

  @Prop({ type: Date, default: Date.now })
  bidTime?: Date;
}

export const BidSchema = SchemaFactory.createForClass(Bid);

export type ProductDocument = HydratedDocument<Product>;
@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  itemName: string;

  @Prop({ required: true })
  itemDescription: string;

  @Prop({ required: true })
  itemCategory: string;

  @Prop({ type: String, default: '' })
  itemPhoto: string;

  @Prop({ required: true })
  startingPrice: number;

  @Prop({ default: 0 })
  currentPrice: number;

  @Prop({ type: Date, default: Date.now })
  itemStartDate: Date;

  @Prop({ type: Date, required: true })
  itemEndDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seller: Types.ObjectId;

  @Prop({ type: [BidSchema], default: [] })
  bids: Bid[];

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  winner: Types.ObjectId;

  @Prop({ default: false })
  isSold: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
