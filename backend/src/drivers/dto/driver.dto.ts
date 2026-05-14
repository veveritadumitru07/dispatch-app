import { IsString, IsOptional, IsIn, IsEmail } from 'class-validator';

export class CreateDriverDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  truckNumber?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsIn(['available', 'on_load', 'home_time', 'inactive'])
  status?: string;
}

export class UpdateDriverDto extends CreateDriverDto {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;
}
