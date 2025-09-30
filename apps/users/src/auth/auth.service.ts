import { Login, LoginDocument, LoginDto, SignUpDto, User, UserDocument } from '@app/contracts';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Login.name) private loginModel: Model<LoginDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}
  async signup({ name, email, password, ip, location, userAgent }: SignUpDto) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new RpcException('User already exists');
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
      avatar: 'https://avatar.iran.liara.run/public/7',
      ipAddress: ip,
      userAgent,
      location,
      signupAt: new Date(),
      lastLogin: new Date(),
    });
    await newUser.save();

    const login = new this.loginModel({
      userId: newUser._id,
      ipAddress: ip,
      userAgent,
      location,
      loginAt: new Date(),
    });
    await login.save();

    return this.generateToken(newUser._id.toString(), newUser.role);
  }

  async login({ email, password, ip, userAgent, location }: LoginDto) {
    const existingUser = await this.userModel.findOne({ email });
    if (!existingUser) {
      throw new RpcException('User not found');
    }

    const psswordValidate = await this.passwordService.comparePassword(password, existingUser.password);
    if (!psswordValidate) {
      throw new RpcException('Invalid Credentials');
    }

    // Update user's last login and location
    await this.userModel.findByIdAndUpdate(existingUser._id, {
      lastLogin: new Date(),
      location: location,
      ipAddress: ip,
      userAgent: userAgent,
    });

    // Saving login details
    const login = new this.loginModel({
      userId: existingUser._id,
      ipAddress: ip,
      userAgent,
      location,
      loginAt: new Date(),
    });
    await login.save();

    return this.generateToken(existingUser._id.toString(), existingUser.role);
  }

  async generateToken(userId: string, role: string): Promise<string> {
    return this.jwtService.signAsync({ id: userId, role });
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}
