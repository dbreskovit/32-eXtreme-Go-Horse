import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Agendamento } from '../entities/agendamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agendamento])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
