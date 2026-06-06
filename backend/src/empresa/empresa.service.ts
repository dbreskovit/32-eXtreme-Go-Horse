import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from '../entities/empresa.entity';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private empresaRepo: Repository<Empresa>,
  ) {}

  async getMe(empresaId: string) {
    const empresa = await this.empresaRepo.findOne({
      where: { id: empresaId },
      relations: { plano: true },
    });
    if (!empresa) throw new NotFoundException('Empresa não encontrada');
    return empresa;
  }

  async updateMe(empresaId: string, dto: UpdateEmpresaDto) {
    await this.empresaRepo.update(empresaId, dto);
    return this.getMe(empresaId);
  }
}
