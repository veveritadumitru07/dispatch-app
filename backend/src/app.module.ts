import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { LoadsModule } from './loads/loads.module';
import { DriversModule } from './drivers/drivers.module';
import { BrokersModule } from './brokers/brokers.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './auth/entities/user.entity';
import { Load } from './loads/entities/load.entity';
import { Driver } from './drivers/entities/driver.entity';
import { Broker } from './brokers/entities/broker.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'dispatch_db',
      entities: [User, Load, Driver, Broker],
      synchronize: true, // creează automat tabelele la pornire
    }),
    AuthModule,
    LoadsModule,
    DriversModule,
    BrokersModule,
    ReportsModule,
  ],
})
export class AppModule {}
