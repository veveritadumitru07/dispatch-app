import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoadsService } from './loads.service';
import { LoadsController } from './loads.controller';
import { Load } from './entities/load.entity';
import { Driver } from '../drivers/entities/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Load, Driver])],
  providers: [LoadsService],
  controllers: [LoadsController],
})
export class LoadsModule {}
