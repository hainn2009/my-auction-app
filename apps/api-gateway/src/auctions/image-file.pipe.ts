import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ImageFilePipe implements PipeTransform<Express.Multer.File> {
  transform(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');

    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`);
    }

    if (file.size > 1024 * 1024) {
      throw new BadRequestException('File size exceeds 1MB');
    }

    return file;
  }
}
