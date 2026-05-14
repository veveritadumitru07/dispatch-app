import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Broker } from './entities/broker.entity';
import { CreateBrokerDto, UpdateBrokerDto } from './dto/broker.dto';

@Injectable()
export class BrokersService {
  constructor(@InjectRepository(Broker) private brokerRepo: Repository<Broker>) {}

  findAll() {
    return this.brokerRepo.find({ order: { companyName: 'ASC' } });
  }

  async findOne(id: number) {
    const broker = await this.brokerRepo.findOne({ where: { id } });
    if (!broker) throw new NotFoundException(`Broker-ul cu id=${id} nu a fost găsit`);
    return broker;
  }

  create(dto: CreateBrokerDto) {
    const broker = this.brokerRepo.create(dto as any);
    return this.brokerRepo.save(broker);
  }

  async update(id: number, dto: UpdateBrokerDto) {
    const broker = await this.findOne(id);
    Object.assign(broker, dto);
    return this.brokerRepo.save(broker);
  }

  async remove(id: number) {
    const broker = await this.findOne(id);
    await this.brokerRepo.remove(broker);
    return { message: 'Broker șters cu succes' };
  }
}
