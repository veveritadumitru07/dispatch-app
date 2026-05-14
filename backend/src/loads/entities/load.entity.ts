import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Driver } from '../../drivers/entities/driver.entity';
import { Broker } from '../../brokers/entities/broker.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('loads')
export class Load {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pickup_location', length: 200 })
  pickupLocation: string;

  @Column({ name: 'delivery_location', length: 200 })
  deliveryLocation: string;

  @Column({ name: 'pickup_date', type: 'date' })
  pickupDate: Date;

  @Column({ name: 'delivery_date', type: 'date' })
  deliveryDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  miles: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rate: number;

  @Column({ name: 'commission_percent', type: 'decimal', precision: 5, scale: 2, default: 6.0 })
  commissionPercent: number;

  @Column({ length: 20, default: 'booked' })
  status: 'booked' | 'in_transit' | 'delivered' | 'cancelled';

  @Column({ name: 'broker_id', nullable: true })
  brokerId: number;

  @ManyToOne(() => Broker, { nullable: true, eager: true })
  @JoinColumn({ name: 'broker_id' })
  broker: Broker;

  @Column({ name: 'driver_id', nullable: true })
  driverId: number;

  @ManyToOne(() => Driver, { nullable: true, eager: true })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column({ name: 'dispatcher_id', nullable: true })
  dispatcherId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'dispatcher_id' })
  dispatcher: User;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
