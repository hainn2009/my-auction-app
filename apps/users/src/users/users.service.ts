import { Login, LoginDocument, User, UserDocument } from '@app/contracts';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateUserDto } from '../../../../libs/contracts/src/users/update-user.dto';
import { PasswordService } from '../auth/password.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Login.name) private loginModel: Model<LoginDocument>,
    private readonly passwordService: PasswordService,
  ) {}

  findOne(userId: string) {
    return this.userModel.findById(userId).exec();
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const { currentPassword, newPassword } = updateUserDto;

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: `User with id ${userId} not found`,
        },
      };
    }

    const isPasswordValid = await this.passwordService.comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: `Current password is incorrect.`,
        },
      };
    }

    const hashedPassword = await this.passwordService.hashPassword(newPassword);
    user.password = hashedPassword;

    await user.save();

    return {
      success: true,
    };
  }

  async getLoginHistory(userId: string) {
    try {
      const logins = await this.loginModel.aggregate([
        {
          $match: { userId: new Types.ObjectId(userId) },
        },
        {
          $sort: { loginAt: -1 },
        },
        {
          $limit: 10,
        },
      ]);

      const formatted = logins.map((login) => {
        const date = new Date(login.loginAt);
        const formattedDate = date.toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        const location = [login.location?.city, login.location?.region, login.location?.country]
          .filter(Boolean)
          .join(', ');

        return {
          id: login._id,
          dateTime: formattedDate,
          ipAddress: login.ipAddress || 'Unknown',
          location: location || 'Unknown',
          isp: login.location?.isp || 'Unknown',
          device: this.getDeviceType(login.userAgent),
        };
      });

      return { success: true, data: formatted };
    } catch (error) {
      console.error('Error fetching login history:', error);
      return {
        success: false,
        message: 'Could not fetch login logs',
      };
    }
  }

  getDeviceType(userAgent = '') {
    userAgent = userAgent.toLowerCase();
    if (/mobile|iphone|ipod|android.*mobile|windows phone/.test(userAgent)) return 'Mobile';
    if (/tablet|ipad|android(?!.*mobile)/.test(userAgent)) return 'Tablet';
    return 'Desktop';
  }
}
