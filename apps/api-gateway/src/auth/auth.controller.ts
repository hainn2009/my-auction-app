import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { GeoLocationService } from './utils/geo-location.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly geoLocationService: GeoLocationService,
  ) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signUpDto: SignUpDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const ip = this.geoLocationService.getClientIp(req);
      const userAgent = req.headers['user-agent'];
      const location = await this.geoLocationService.getLocationFromIp(ip);

      const token = await this.authService.signup({ ...signUpDto, ip, userAgent, location });

      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // require https in production
        // dev need lax to allow send cookie through http, prod cross-site set to none and require https
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return { message: 'User registered successfully' };
    } catch (err) {
      throw new BadRequestException(err.message || 'Signup failed');
    }
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      // Getting user geo location
      const ip = this.geoLocationService.getClientIp(req);
      const userAgent = req.headers['user-agent'];
      const location = await this.geoLocationService.getLocationFromIp(ip);

      const token = await this.authService.login({ ...loginDto, ip, userAgent, location });

      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return { message: 'Login Successful' };
    } catch (err) {
      throw new BadRequestException(err.message || 'Login failed');
    }
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return { message: 'Logged out successfully' };
  }
}
