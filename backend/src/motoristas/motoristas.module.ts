import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MotoristasService } from './motoristas.service';
import { MotoristasController } from './motoristas.controller';
import { Motorista } from '../entities/motorista.entity';
import { Veiculo } from '../entities/veiculo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Motorista, Veiculo])],
  controllers: [MotoristasController],
  providers: [MotoristasService],
})
export class MotoristasModule {}
