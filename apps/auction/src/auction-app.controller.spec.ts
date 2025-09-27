import { Test, TestingModule } from '@nestjs/testing';
import { AuctionAppController } from './auction-app.controller';
import { AuctionAppService } from './auction-app.service';

describe('AuctionController', () => {
  let auctionController: AuctionAppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuctionAppController],
      providers: [AuctionAppService],
    }).compile();

    auctionController = app.get<AuctionAppController>(AuctionAppController);
  });

  describe('root', () => {
    it('should return "App is running!"', () => {
      expect(auctionController.getHealth()).toBe('App is running!');
    });
  });
});
