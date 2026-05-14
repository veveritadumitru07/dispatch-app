import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Load } from './entities/load.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { CreateLoadDto, UpdateLoadDto } from './dto/load.dto';

@Injectable()
export class LoadsService {
  constructor(
    @InjectRepository(Load) private loadRepo: Repository<Load>,
    @InjectRepository(Driver) private driverRepo: Repository<Driver>,
  ) {}

  async findAll(status?: string) {
    const qb = this.loadRepo
      .createQueryBuilder('load')
      .leftJoinAndSelect('load.broker', 'broker')
      .leftJoinAndSelect('load.driver', 'driver')
      .orderBy('load.pickupDate', 'DESC');

    if (status) qb.where('load.status = :status', { status });
    return qb.getMany();
  }

  async findOne(id: number) {
    const load = await this.loadRepo.findOne({ where: { id } });
    if (!load) throw new NotFoundException(`Cursa cu id=${id} nu a fost găsită`);
    return load;
  }

  async create(dto: CreateLoadDto, dispatcherId: number) {
    const load = this.loadRepo.create({ ...dto, dispatcherId } as any);
    const saved = await this.loadRepo.save(load);

    // Update driver status
    if (dto.driverId) {
      await this.driverRepo.update(dto.driverId, { status: 'on_load' });
    }

    return saved;
  }

  async update(id: number, dto: UpdateLoadDto) {
    const load = await this.findOne(id);
    const previousDriverId = load.driverId;
    const previousStatus = load.status;

    Object.assign(load, dto);
    const saved = await this.loadRepo.save(load);

    // Driver status logic
    if (dto.driverId && dto.driverId !== previousDriverId) {
      if (previousDriverId) {
        await this.driverRepo.update(previousDriverId, { status: 'available' });
      }
      await this.driverRepo.update(dto.driverId, { status: 'on_load' });
    }

    if (dto.status === 'delivered' && previousStatus !== 'delivered' && load.driverId) {
      await this.driverRepo.update(load.driverId, { status: 'available' });
    }

    return saved;
  }

  async remove(id: number) {
    const load = await this.findOne(id);
    if (load.driverId && load.status !== 'delivered') {
      await this.driverRepo.update(load.driverId, { status: 'available' });
    }
    await this.loadRepo.remove(load);
    return { message: 'Cursă ștearsă cu succes' };
  }
}
