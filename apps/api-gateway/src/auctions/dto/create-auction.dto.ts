import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAuctionDto {
  @IsNotEmpty()
  itemName: string;

  @IsNumber()
  startingPrice: number;

  itemDescription: string;

  itemCategory: string;

  itemStartDate: Date;

  itemEndDate: Date;
}
