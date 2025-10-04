import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateAuctionDto {
  @IsNotEmpty()
  itemName: string;

  @Type(() => Number)
  @IsNumber()
  startingPrice: number;

  @IsNotEmpty()
  itemDescription: string;

  @IsNotEmpty()
  itemCategory: string;

  @IsNotEmpty()
  itemStartDate: Date;

  @IsNotEmpty()
  itemEndDate: Date;

  @IsOptional()
  itemPhoto: Express.Multer.File;
}
