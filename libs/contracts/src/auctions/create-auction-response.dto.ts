export class CreateAuctionResponseDto {
  id: string;
  itemName: string;
  startingPrice: number;
  itemDescription: string;
  itemCategory: string;
  itemStartDate: Date;
  itemEndDate: Date;
}
