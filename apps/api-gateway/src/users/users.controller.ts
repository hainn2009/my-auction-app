import { BadRequestException, Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsersService } from './users.service';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getCurrentUser(@Req() req: Request) {
    return this.usersService.findOne({ userId: req.user!.userId });
  }

  @Patch()
  async changePassword(@Req() req: Request, @Body() body: ChangePasswordDto) {
    const { currentPassword, newPassword } = body;
    if (!currentPassword || !newPassword) {
      throw new BadRequestException('Please enter all fields');
    }

    if (currentPassword === newPassword) {
      throw new BadRequestException("You can't reuse the old password.");
    }
    const response = await this.usersService.changePassword({ userId: req.user!.userId, ...body });

    if (!response.success) {
      throw new BadRequestException(response.error.message);
    }
    return 'Password changed successfully';
  }

  @Get('logins')
  async getLoginHistory(@Req() req: Request) {
    const response = await this.usersService.getLoginHistory(req.user!.userId);
    if (response.success === false) {
      throw new BadRequestException(response.error.message);
    }
    return response.data;
  }
}
