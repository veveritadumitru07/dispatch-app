import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BrokersService } from './brokers.service';
import { CreateBrokerDto, UpdateBrokerDto } from './dto/broker.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('brokers')
@UseGuards(JwtAuthGuard)
export class BrokersController {
  constructor(private brokersService: BrokersService) {}

  @Get()
  findAll() {
    return this.brokersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brokersService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateBrokerDto) {
    return this.brokersService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBrokerDto) {
    return this.brokersService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brokersService.remove(+id);
  }
}
