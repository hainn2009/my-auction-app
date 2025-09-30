import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateAuctionDto {
  @IsNotEmpty()
  itemName: string;

  @IsNumber()
  startingPrice: number;

  @IsNotEmpty()
  itemDescription: string;

  @IsNotEmpty()
  itemCategory: string;

  @IsOptional()
  itemStartDate: Date;

  @IsOptional()
  itemEndDate: Date;
}
