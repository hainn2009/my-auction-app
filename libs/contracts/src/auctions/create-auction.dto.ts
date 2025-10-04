export class CreateAuctionDto {
  itemName: string;
  startingPrice: number;
  itemDescription: string;
  itemCategory: string;
  itemStartDate: Date;
  itemEndDate: Date;
  userId: string;
  itemPhotoUrl: string;
}
