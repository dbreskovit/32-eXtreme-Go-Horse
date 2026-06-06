import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocasService } from './docas.service';
import { DocasController } from './docas.controller';
import { Doca } from '../entities/doca.entity';
import { HorarioOperacao } from '../entities/horario-operacao.entity';
import { Unidade } from '../entities/unidade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doca, HorarioOperacao, Unidade])],
  controllers: [DocasController],
  providers: [DocasService],
})
export class DocasModule {}
