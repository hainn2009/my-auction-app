import { AUTH_PATTERN, SignUpDto } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { USERS_CLIENT } from '../constant';
import { LoginDto } from './dto/login.dto';

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
