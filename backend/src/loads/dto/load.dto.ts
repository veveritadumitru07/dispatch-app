import { IsString, IsNumber, IsOptional, IsIn, IsDateString, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLoadDto {
  @IsString()
  pickupLocation: string;

  @IsString()
  deliveryLocation: string;

  @IsDateString()
  pickupDate: string;

  @IsDateString()
  deliveryDate: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  miles: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rate: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  commissionPercent?: number;

  @IsOptional()
  @IsIn(['booked', 'in_transit', 'delivered', 'cancelled'])
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  brokerId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  driverId?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateLoadDto extends CreateLoadDto {
  @IsOptional() pickupLocation: string;
  @IsOptional() deliveryLocation: string;
  @IsOptional() pickupDate: string;
  @IsOptional() deliveryDate: string;
  @IsOptional() miles: number;
  @IsOptional() rate: number;
}
