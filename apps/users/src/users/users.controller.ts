import { GetUserDto } from '@app/contracts/users/get-user.dto';
import { UpdateUserDto } from '@app/contracts/users/update-user.dto';
import { USERS_PATTERN } from '@app/contracts/users/users.pattern';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USERS_PATTERN.FIND_ONE)
  findOne(@Payload() { userId }: GetUserDto) {
    return this.usersService.findOne(userId);
  }

  @MessagePattern(USERS_PATTERN.UPDATE)
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.userId, updateUserDto);
  }

  @MessagePattern(USERS_PATTERN.GET_LOGIN_HISTORY)
  getLoginHistory(@Payload() { userId }: { userId: string }) {
    return this.usersService.getLoginHistory(userId);
  }
}
