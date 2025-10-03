import { IsNotEmpty } from 'class-validator';

export class PlaceBidDto {
  // TODO: need to update to Number after testing
  @IsNotEmpty()
  bidAmount: string;
}
