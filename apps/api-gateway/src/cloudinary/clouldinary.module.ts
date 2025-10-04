// cloudinary.module.ts
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

@Global()
@Module({})
export class CloudinaryModule {
  static forRootAsync(): DynamicModule {
    return {
      module: CloudinaryModule,
      providers: [
        {
          provide: 'CLOUDINARY',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            cloudinary.config({
              cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
              api_key: configService.get<string>('CLOUDINARY_API_KEY'),
              api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
            });
            return cloudinary;
          },
        },
        {
          provide: 'CLOUDINARY_STORAGE',
          inject: ['CLOUDINARY'],
          useFactory: (cloudinary) => {
            return new CloudinaryStorage({
              cloudinary,
              params: (req, file) => {
                const ext = file.mimetype.split('/')[1];
                const base = file.originalname.split('.')[0];
                return {
                  folder: 'auctions',
                  format: ext,
                  public_id: `${Date.now()}-${base}`,
                };
              },
            });
          },
        },
      ],
      exports: ['CLOUDINARY', 'CLOUDINARY_STORAGE'],
    };
  }
}
