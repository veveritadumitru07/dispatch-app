import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsOptional()
  @IsIn(['admin', 'dispatcher'])
  role?: 'admin' | 'dispatcher';
}

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
