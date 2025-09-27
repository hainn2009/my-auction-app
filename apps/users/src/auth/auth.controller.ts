import { AUTH_PATTERN, LoginDto, SignUpDto } from '@app/contracts';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERN.SIGNUP)
  signup(@Payload() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @MessagePattern(AUTH_PATTERN.LOGIN)
  login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
