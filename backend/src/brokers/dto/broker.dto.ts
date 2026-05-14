import { IsString, IsOptional, IsInt, Min, Max, IsEmail } from 'class-validator';

export class CreateBrokerDto {
  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  mcNumber?: string;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  paymentTermsDays?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}

export class UpdateBrokerDto extends CreateBrokerDto {
  @IsOptional()
  companyName: string;
}
