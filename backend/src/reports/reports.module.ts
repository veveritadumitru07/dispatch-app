import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Load } from '../loads/entities/load.entity';
import { Driver } from '../drivers/entities/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Load, Driver])],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
