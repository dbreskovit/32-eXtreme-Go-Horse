import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlotsService } from './slots.service';
import { SlotsController } from './slots.controller';
import { Doca } from '../entities/doca.entity';
import { HorarioOperacao } from '../entities/horario-operacao.entity';
import { Agendamento } from '../entities/agendamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doca, HorarioOperacao, Agendamento])],
  controllers: [SlotsController],
  providers: [SlotsService],
  exports: [SlotsService],
})
export class SlotsModule {}
