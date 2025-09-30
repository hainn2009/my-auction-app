import { Login, LoginSchema, User, UserSchema } from '@app/contracts';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'defaultSecret'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '1h'),
        },
      }),
    }),
    MongooseModule.forFeature([
      {
        name: Login.name,
        schema: LoginSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
})
export class AuthModule {}
