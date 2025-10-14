import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as joi from 'joi';
import { AuctionsAppController } from './auctions-app.controller';
import { AuctionsAppService } from './auctions-app.service';
import { AuctionsModule } from './auctions/auctions.module';
import { BidsModule } from './bids/bids.module';
import { ItemsModule } from './items/items.module';
import { DbWorkerModule } from './db-worker/db-worker.module';

@Module({
  imports: [
    AuctionsModule,
    ItemsModule,
    BidsModule,
    ConfigModule.forRoot({
      isGlobal: false,
      validationSchema: joi.object({
        MONGODB_URI: joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    DbWorkerModule,
  ],
  controllers: [AuctionsAppController],
  providers: [AuctionsAppService],
})
export class AuctionsAppModule {}
