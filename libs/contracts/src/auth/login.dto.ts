import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  ip: string;

  location: {
    country: string;
    region: string;
    city: string;
    isp: string;
  };

  userAgent?: string;
}
