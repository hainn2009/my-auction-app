import { Test, TestingModule } from '@nestjs/testing';
import { AuctionsAppController } from './auctions-app.controller';
import { AuctionsAppService } from './auctions-app.service';

describe('AuctionController', () => {
  let auctionController: AuctionsAppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuctionsAppController],
      providers: [AuctionsAppService],
    }).compile();

    auctionController = app.get<AuctionsAppController>(AuctionsAppController);
  });

  describe('root', () => {
    it('should return "App is running!"', () => {
      expect(auctionController.getHealth()).toBe('App is running!');
    });
  });
});
