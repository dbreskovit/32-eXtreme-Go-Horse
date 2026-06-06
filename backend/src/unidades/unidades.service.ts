import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unidade } from '../entities/unidade.entity';
import { CreateUnidadeDto } from './dto/create-unidade.dto';
import { UpdateUnidadeDto } from './dto/update-unidade.dto';

@Injectable()
export class UnidadesService {
  constructor(
    @InjectRepository(Unidade)
    private unidadeRepo: Repository<Unidade>,
  ) {}

  async findAllPublicas() {
    const unidades = await this.unidadeRepo
      .createQueryBuilder('unidade')
      .leftJoinAndSelect('unidade.docas', 'docas', 'docas.ativa = true')
      .getMany();

    return unidades.map((u) => ({
      id: u.id,
      nome: u.nome,
      cidade: u.cidade,
      estado: u.estado,
      endereco: u.endereco,
      totalDocas: u.docas.length,
      docas: u.docas.map((d) => ({
        id: d.id,
        nome: d.nome,
        tipoCarga: d.tipoCarga,
        capacidadeTonHora: d.capacidadeTonHora,
        ativa: d.ativa,
      })),
    }));
  }

  async findAll(empresaId: string) {
    const unidades = await this.unidadeRepo
      .createQueryBuilder('unidade')
      .leftJoinAndSelect('unidade.docas', 'docas')
      .where('unidade.empresaId = :empresaId', { empresaId })
      .getMany();

    return unidades.map((u) => ({
      ...u,
      contagemDocas: u.docas.length,
      docas: undefined, // don't return full docas in list
    }));
  }

  async create(empresaId: string, dto: CreateUnidadeDto) {
    const unidade = this.unidadeRepo.create({ ...dto, empresaId });
    return this.unidadeRepo.save(unidade);
  }

  async update(empresaId: string, id: string, dto: UpdateUnidadeDto) {
    const unidade = await this.unidadeRepo.findOne({ where: { id, empresaId } });
    if (!unidade) throw new NotFoundException('Unidade não encontrada');

    await this.unidadeRepo.update(id, dto);
    return this.unidadeRepo.findOne({ where: { id } });
  }

  async remove(empresaId: string, id: string) {
    const unidade = await this.unidadeRepo.findOne({ where: { id, empresaId } });
    if (!unidade) throw new NotFoundException('Unidade não encontrada');

    await this.unidadeRepo.remove(unidade);
    return { success: true };
  }
}
