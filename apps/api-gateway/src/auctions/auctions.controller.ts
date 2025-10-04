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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { CloudinaryUpload } from '../cloudinary/cloudinary-upload.decorator';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { PlaceBidDto } from './dto/place-bid.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { ImageFilePipe } from './image-file.pipe';

@Controller('auction')
@UseGuards(AuthGuard('jwt'))
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  @CloudinaryUpload('itemPhoto')
  async create(
    @Body() createAuctionDto: CreateAuctionDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @UploadedFile(ImageFilePipe) file: Express.Multer.File,
  ) {
    try {
      const newAuction = await this.auctionsService.create({
        ...createAuctionDto,
        userId: req.user!.userId,
        itemPhotoUrl: file.path,
      });

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
    return this.auctionsService.findOne({ id });
  }

  @Post(':id')
  placeBid(@Param('id') id: string, @Body() { bidAmount }: PlaceBidDto, @Req() req: Request) {
    return this.auctionsService.placeBid({ userId: req.user!.userId, auctionId: id, bidAmount: Number(bidAmount) });
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
