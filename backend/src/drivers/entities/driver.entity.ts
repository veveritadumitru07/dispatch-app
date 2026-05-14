import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', length: 50 })
  firstName: string;

  @Column({ name: 'last_name', length: 50 })
  lastName: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ name: 'truck_number', length: 20, nullable: true })
  truckNumber: string;

  @Column({ name: 'license_number', length: 50, nullable: true })
  licenseNumber: string;

  @Column({ length: 20, default: 'available' })
  status: 'available' | 'on_load' | 'home_time' | 'inactive';

  @Column({ name: 'hired_at', type: 'date', default: () => 'CURRENT_DATE' })
  hiredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
