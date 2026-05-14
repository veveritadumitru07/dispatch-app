import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { CreateDriverDto, UpdateDriverDto } from './dto/driver.dto';

@Injectable()
export class DriversService {
  constructor(@InjectRepository(Driver) private driverRepo: Repository<Driver>) {}

  findAll(status?: string) {
    if (status) {
      return this.driverRepo.find({ where: { status: status as any }, order: { lastName: 'ASC' } });
    }
    return this.driverRepo.find({ order: { lastName: 'ASC' } });
  }

  async findOne(id: number) {
    const driver = await this.driverRepo.findOne({ where: { id } });
    if (!driver) throw new NotFoundException(`Șoferul cu id=${id} nu a fost găsit`);
    return driver;
  }

  create(dto: CreateDriverDto) {
   const driver = this.driverRepo.create(dto as any);
    return this.driverRepo.save(driver);
  }

  async update(id: number, dto: UpdateDriverDto) {
    const driver = await this.findOne(id);
    Object.assign(driver, dto);
    return this.driverRepo.save(driver);
  }

  async remove(id: number) {
    const driver = await this.findOne(id);
    await this.driverRepo.remove(driver);
    return { message: 'Șofer șters cu succes' };
  }
}
