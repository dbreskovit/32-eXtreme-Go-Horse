import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Motorista } from '../entities/motorista.entity';
import { Veiculo } from '../entities/veiculo.entity';
import { UpdateMotoristaDto } from './dto/update-motorista.dto';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';

@Injectable()
export class MotoristasService {
  constructor(
    @InjectRepository(Motorista)
    private motoristaRepo: Repository<Motorista>,
    @InjectRepository(Veiculo)
    private veiculoRepo: Repository<Veiculo>,
  ) {}

  async getMe(motoristaId: string) {
    return this.motoristaRepo.findOne({ where: { id: motoristaId } });
  }

  async updateMe(motoristaId: string, dto: UpdateMotoristaDto) {
    await this.motoristaRepo.update(motoristaId, dto);
    return this.getMe(motoristaId);
  }

  async getVeiculos(motoristaId: string) {
    return this.veiculoRepo.find({ where: { motoristaId } });
  }

  async createVeiculo(motoristaId: string, dto: CreateVeiculoDto) {
    const existe = await this.veiculoRepo.findOne({ where: { placa: dto.placa } });
    if (existe) {
      if (existe.motoristaId === motoristaId) return existe;
      throw new ConflictException('Veículo já cadastrado para outro motorista');
    }

    const veiculo = this.veiculoRepo.create({ ...dto, motoristaId });
    return this.veiculoRepo.save(veiculo);
  }
}
