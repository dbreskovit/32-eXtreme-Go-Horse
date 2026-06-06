import { Module } from '@nestjs/common';
import { AgendamentosGateway } from './agendamentos.gateway';

@Module({
  providers: [AgendamentosGateway],
  exports: [AgendamentosGateway],
})
export class GatewayModule {}
