import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  ip: string;

  location: {
    country: string;
    region: string;
    city: string;
    isp: string;
  };

  userAgent?: string;

  createdAt?: Date;
}
