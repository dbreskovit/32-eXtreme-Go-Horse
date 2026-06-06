import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doca } from '../entities/doca.entity';
import { HorarioOperacao } from '../entities/horario-operacao.entity';
import { Unidade } from '../entities/unidade.entity';
import { CreateDocaDto } from './dto/create-doca.dto';
import { UpdateDocaDto } from './dto/update-doca.dto';
import { UpdateHorariosDto } from './dto/update-horarios.dto';

@Injectable()
export class DocasService {
  constructor(
    @InjectRepository(Doca)
    private docaRepo: Repository<Doca>,
    @InjectRepository(HorarioOperacao)
    private horarioRepo: Repository<HorarioOperacao>,
    @InjectRepository(Unidade)
    private unidadeRepo: Repository<Unidade>,
  ) {}

  private async checkUnidade(empresaId: string, unidadeId: string) {
    const unidade = await this.unidadeRepo.findOne({ where: { id: unidadeId, empresaId } });
    if (!unidade) throw new NotFoundException('Unidade não encontrada ou não pertence à empresa');
    return unidade;
  }

  private async checkDoca(empresaId: string, docaId: string) {
    const doca = await this.docaRepo.findOne({
      where: { id: docaId },
      relations: { unidade: true },
    });
    if (!doca || doca.unidade.empresaId !== empresaId) {
      throw new NotFoundException('Doca não encontrada ou não pertence à empresa');
    }
    return doca;
  }

  async findAll(empresaId: string, unidadeId: string) {
    await this.checkUnidade(empresaId, unidadeId);
    return this.docaRepo.find({
      where: { unidadeId },
      relations: { horarios: true },
    });
  }

  async create(empresaId: string, unidadeId: string, dto: CreateDocaDto) {
    await this.checkUnidade(empresaId, unidadeId);
    const doca = this.docaRepo.create({ ...dto, unidadeId });
    return this.docaRepo.save(doca);
  }

  async update(empresaId: string, id: string, dto: UpdateDocaDto) {
    await this.checkDoca(empresaId, id);
    await this.docaRepo.update(id, dto);
    return this.docaRepo.findOne({ where: { id } });
  }

  async remove(empresaId: string, id: string) {
    const doca = await this.checkDoca(empresaId, id);
    await this.docaRepo.remove(doca);
    return { success: true };
  }

  async updateHorarios(empresaId: string, id: string, dto: UpdateHorariosDto) {
    await this.checkDoca(empresaId, id);

    // Bulk replace: delete existing, insert new
    await this.horarioRepo.delete({ docaId: id });
    
    const horariosToInsert = dto.horarios.map((h) =>
      this.horarioRepo.create({
        diaSemana: h.diaSemana,
        horaInicio: h.horaInicio,
        horaFim: h.horaFim,
        docaId: id,
      }),
    );
    
    if (horariosToInsert.length > 0) {
      await this.horarioRepo.save(horariosToInsert);
    }
    
    return this.docaRepo.findOne({ where: { id }, relations: { horarios: true } });
  }
}
