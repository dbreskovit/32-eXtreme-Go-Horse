import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendamentosService } from './agendamentos.service';
import { AgendamentosController } from './agendamentos.controller';
import { Agendamento } from '../entities/agendamento.entity';
import { HistoricoStatusAgendamento } from '../entities/historico-status-agendamento.entity';
import { Doca } from '../entities/doca.entity';
import { Veiculo } from '../entities/veiculo.entity';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agendamento, HistoricoStatusAgendamento, Doca, Veiculo]),
    GatewayModule,
  ],
  controllers: [AgendamentosController],
  providers: [AgendamentosService],
})
export class AgendamentosModule {}
