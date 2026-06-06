import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanosService } from './planos.service';
import { PlanosController } from './planos.controller';
import { Plano } from '../entities/plano.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plano])],
  controllers: [PlanosController],
  providers: [PlanosService],
})
export class PlanosModule {}
