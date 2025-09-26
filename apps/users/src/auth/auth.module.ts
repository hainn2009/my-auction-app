import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Login, LoginSchema } from '../schemas/Login.schema';
import { User, UserSchema } from '../schemas/users.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [MongooseModule.forFeature([{
    name: Login.name,
    schema: LoginSchema
  }, {
    name: User.name,
    schema: UserSchema
  }])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
