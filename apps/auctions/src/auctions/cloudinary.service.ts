import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'auctions',
      });
      return result.secure_url;
    } catch (error) {
      throw new Error('Error uploading image to Cloudinary');
    }
  }
}
