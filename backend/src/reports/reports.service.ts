import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Load } from '../loads/entities/load.entity';
import { Driver } from '../drivers/entities/driver.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Load) private loadRepo: Repository<Load>,
    @InjectRepository(Driver) private driverRepo: Repository<Driver>,
  ) {}

  async getSummary() {
    const loads = await this.loadRepo.find();
    const drivers = await this.driverRepo.find();

    const delivered = loads.filter((l) => l.status === 'delivered');
    const inTransit = loads.filter((l) => l.status === 'in_transit');
    const booked = loads.filter((l) => l.status === 'booked');

    const totalGross = delivered.reduce((s, l) => s + Number(l.rate), 0);
    const totalMiles = delivered.reduce((s, l) => s + Number(l.miles), 0);
    const totalCommission = delivered.reduce(
      (s, l) => s + (Number(l.rate) * Number(l.commissionPercent)) / 100,
      0,
    );
    const avgRpm = totalMiles > 0 ? totalGross / totalMiles : 0;

    return {
      totals: {
        gross: Number(totalGross.toFixed(2)),
        miles: Number(totalMiles.toFixed(2)),
        commission: Number(totalCommission.toFixed(2)),
        avgRpm: Number(avgRpm.toFixed(2)),
      },
      counts: {
        totalLoads: loads.length,
        delivered: delivered.length,
        inTransit: inTransit.length,
        booked: booked.length,
      },
      drivers: {
        total: drivers.length,
        available: drivers.filter((d) => d.status === 'available').length,
        onLoad: drivers.filter((d) => d.status === 'on_load').length,
        homeTime: drivers.filter((d) => d.status === 'home_time').length,
      },
    };
  }

  async getLoadsByStatus() {
    const loads = await this.loadRepo.find();
    const groups: Record<string, number> = {};
    for (const l of loads) {
      groups[l.status] = (groups[l.status] || 0) + 1;
    }
    return Object.entries(groups).map(([status, count]) => ({ status, count }));
  }

  async getTopBrokers() {
    const loads = await this.loadRepo.find();
    const map = new Map<string, { name: string; gross: number; count: number }>();
    for (const l of loads) {
      if (!l.broker) continue;
      const key = l.broker.companyName;
      const entry = map.get(key) || { name: key, gross: 0, count: 0 };
      entry.gross += Number(l.rate);
      entry.count += 1;
      map.set(key, entry);
    }
    return Array.from(map.values())
      .sort((a, b) => b.gross - a.gross)
      .slice(0, 5)
      .map((b) => ({ ...b, gross: Number(b.gross.toFixed(2)) }));
  }
}
