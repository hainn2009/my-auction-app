import { BadRequestException, Body, ConflictException, Controller, HttpCode, HttpStatus, Logger, Post, Req, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { GeoLocationService } from './utils/geo-location.service';

function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === 'string') {
    return err;
  }

  if (err && typeof err === 'object') {
    const maybeMessage = (err as { message?: unknown; error?: unknown }).message;
    if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
      return maybeMessage;
    }

    const nestedError = (err as { error?: unknown }).error;
    if (typeof nestedError === 'string' && nestedError.trim()) {
      return nestedError;
    }

    if (
      nestedError &&
      typeof nestedError === 'object' &&
      'message' in nestedError &&
      typeof (nestedError as { message?: unknown }).message === 'string'
    ) {
      return (nestedError as { message: string }).message;
    }
  }

  return fallback;
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

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
      this.logger.error('Signup error:', err);
      const message = getErrorMessage(err, 'Signup failed');
      if (message.toLowerCase().includes('already exists')) {
        throw new ConflictException({ error: message });
      }
      throw new BadRequestException({ error: message });
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
      this.logger.error('Login error:', err);
      const message = getErrorMessage(err, 'Login failed');
      throw new BadRequestException({ error: message });
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
