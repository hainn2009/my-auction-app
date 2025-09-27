// src/common/services/geo-location.service.ts
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GeoLocationService {
  private readonly logger = new Logger(GeoLocationService.name);

  constructor(private readonly httpService: HttpService) {}

  async getLocationFromIp(ip: string) {
    const defaultLocation = {
      country: 'Unknown',
      region: 'Unknown',
      city: 'Unknown',
      isp: 'Unknown',
    };

    try {
      const response = await firstValueFrom(this.httpService.get(`http://ip-api.com/json/${ip}`));

      if (response.data?.status === 'success') {
        return {
          country: response.data.country,
          region: response.data.regionName,
          city: response.data.city,
          isp: response.data.isp,
        };
      }

      return defaultLocation;
    } catch (error) {
      this.logger.error('Geo API error:', error.message);
      return defaultLocation;
    }
  }

  getClientIp(req: any): string {
    return req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '0.0.0.0';
  }
}
