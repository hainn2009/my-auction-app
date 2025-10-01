import { IsNumber } from 'class-validator';

export class PlaceBidDto {
  @IsNumber()
  bidAmount: number;
}
