import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';

@Controller('auctions')
@UseGuards(AuthGuard('jwt'))
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createAuctionDto: CreateAuctionDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const { itemName, startingPrice, itemDescription, itemCategory, itemStartDate, itemEndDate } = createAuctionDto;

      const newAuction = await this.auctionsService.create({ ...createAuctionDto, userId: req.user!.userId, file });

      return { message: 'Auction created successfully', newAuction };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get()
  findAll() {
    return this.auctionsService.findAll();
  }

  // Place before @Get(':id') to avoid route conflict
  @Get('stats')
  getStats(@Req() req: Request) {
    return this.auctionsService.getStats(req.user!.userId);
  }

  @Get('my-auctions')
  getMyAuctions(@Req() req: Request) {
    return this.auctionsService.getMyAuctions(req.user!.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auctionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto) {
    return this.auctionsService.update({ id, ...updateAuctionDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auctionsService.remove(+id);
  }
}
