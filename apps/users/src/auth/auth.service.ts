import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Login, LoginDocument } from '../schemas/Login.schema';
import { User, UserDocument } from '../schemas/users.schema';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Login.name) private loginModel: Model<LoginDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>) { }
  async signup(signUpDto: SignUpDto) {
    const newLogin = new this.loginModel(signUpDto);
    return newLogin.save();
  }

  async login(loginDto: LoginDto) {
    this.userModel.findOne({ email: loginDto.email });
    return `This action returns all auth`;
  }

  async logout({ userId }: LogoutDto) {
    return `This action returns a #${userId} auth`;
  }
}
