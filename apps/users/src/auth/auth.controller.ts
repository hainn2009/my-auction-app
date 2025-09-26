import { AUTH_PATTERN } from '@app/contracts';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern(AUTH_PATTERN.SIGNUP)
  signup(@Payload() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @MessagePattern(AUTH_PATTERN.LOGIN)
  login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessagePattern(AUTH_PATTERN.LOGOUT)
  logout(@Payload() { userId }: LogoutDto) {
    return this.authService.logout({ userId });
  }
}
