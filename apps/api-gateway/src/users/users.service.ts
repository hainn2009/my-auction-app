import { GetUserResponseDto } from '@app/contracts/users/get-user-response.dto';
import { GetUserDto } from '@app/contracts/users/get-user.dto';
import { UpdateUserDto } from '@app/contracts/users/update-user.dto';
import { USERS_PATTERN } from '@app/contracts/users/users.pattern';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { USERS_CLIENT } from '../constant';

@Injectable()
export class UsersService {
  constructor(@Inject(USERS_CLIENT) private usersClient: ClientProxy) {}

  findOne(getUserDto: GetUserDto) {
    return firstValueFrom(this.usersClient.send<GetUserResponseDto>(USERS_PATTERN.FIND_ONE, getUserDto));
  }

  changePassword(updateUserDto: UpdateUserDto) {
    return firstValueFrom(this.usersClient.send(USERS_PATTERN.UPDATE, updateUserDto));
  }

  getLoginHistory(userId: string) {
    return firstValueFrom(this.usersClient.send(USERS_PATTERN.GET_LOGIN_HISTORY, { userId }));
  }
}
