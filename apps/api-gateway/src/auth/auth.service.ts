import { AUTH_PATTERN, LoginDto, SignUpDto } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { USERS_CLIENT } from '../constant';

@Injectable()
export class AuthService {
  constructor(@Inject(USERS_CLIENT) private usersClient: ClientProxy) {}
  signup(signUpDto: SignUpDto) {
    return firstValueFrom(this.usersClient.send<string>(AUTH_PATTERN.SIGNUP, signUpDto));
  }

  login(loginDto: LoginDto) {
    return firstValueFrom(this.usersClient.send<string>(AUTH_PATTERN.LOGIN, loginDto));
  }
}
