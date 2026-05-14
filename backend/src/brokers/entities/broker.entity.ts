import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('brokers')
export class Broker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'company_name', length: 150 })
  companyName: string;

  @Column({ name: 'mc_number', length: 20, unique: true, nullable: true })
  mcNumber: string;

  @Column({ name: 'contact_name', length: 100, nullable: true })
  contactName: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ name: 'payment_terms_days', type: 'int', default: 30 })
  paymentTermsDays: number;

  @Column({ type: 'int', nullable: true })
  rating: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
