// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.auth_token; // tên cookie của bạn
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(), // fallback nếu có header
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET', 'defaultSecret'),
    });
  }

  async validate(payload: any) {
    // payload = { id, role, iat, exp }
    return { userId: payload.id, role: payload.role };
  }
}
