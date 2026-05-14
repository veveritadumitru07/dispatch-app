import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { LoadsService } from './loads.service';
import { CreateLoadDto, UpdateLoadDto } from './dto/load.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('loads')
@UseGuards(JwtAuthGuard)
export class LoadsController {
  constructor(private loadsService: LoadsService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    return this.loadsService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loadsService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateLoadDto, @Req() req) {
    return this.loadsService.create(dto, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLoadDto) {
    return this.loadsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loadsService.remove(+id);
  }
}
