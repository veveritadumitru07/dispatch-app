import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('summary')
  getSummary() {
    return this.reportsService.getSummary();
  }

  @Get('loads-by-status')
  getLoadsByStatus() {
    return this.reportsService.getLoadsByStatus();
  }

  @Get('top-brokers')
  getTopBrokers() {
    return this.reportsService.getTopBrokers();
  }
}
