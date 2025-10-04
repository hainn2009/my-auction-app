import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  currentPassword: string;

  @MinLength(8)
  newPassword: string;

  @IsOptional()
  confirmPassword?: string;
}
