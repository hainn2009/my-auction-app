import { AUTH_PATTERN } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_CLIENT } from '../constant';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(@Inject(USERS_CLIENT) private usersClient: ClientProxy) { }
  signup(signUpDto: SignUpDto) {
    return this.usersClient.send(AUTH_PATTERN.SIGNUP, signUpDto);
  }

  login(loginDto: LoginDto) {
    return this.usersClient.send(AUTH_PATTERN.LOGIN, loginDto);
  }

  logout(logoutDto: LogoutDto) {
    return this.usersClient.send(AUTH_PATTERN.LOGOUT, logoutDto);
  }
}
