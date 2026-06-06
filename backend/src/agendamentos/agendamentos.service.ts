import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Agendamento } from '../entities/agendamento.entity';
import { Doca } from '../entities/doca.entity';
import { Veiculo } from '../entities/veiculo.entity';
import { HistoricoStatusAgendamento } from '../entities/historico-status-agendamento.entity';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { FiltroAgendamentosDto } from './dto/filtro-agendamentos.dto';
import { StatusAgendamento } from '../common/enums/status-agendamento.enum';
import { CryptoUtil } from '../utils/crypto.util';
import { AgendamentosGateway } from '../gateway/agendamentos.gateway';

@Injectable()
export class AgendamentosService {
  constructor(
    @InjectRepository(Agendamento)
    private agendamentoRepo: Repository<Agendamento>,
    @InjectRepository(Doca)
    private docaRepo: Repository<Doca>,
    @InjectRepository(Veiculo)
    private veiculoRepo: Repository<Veiculo>,
    @InjectRepository(HistoricoStatusAgendamento)
    private historicoRepo: Repository<HistoricoStatusAgendamento>,
    private gateway: AgendamentosGateway,
  ) {}

  async create(motoristaId: string, dto: CreateAgendamentoDto) {
    const doca = await this.docaRepo.findOne({ where: { id: dto.docaId }, relations: { unidade: true } });
    if (!doca) throw new NotFoundException('Doca não encontrada');

    const veiculo = await this.veiculoRepo.findOne({ where: { id: dto.veiculoId } });
    if (!veiculo || veiculo.motoristaId !== motoristaId) {
      throw new ForbiddenException('Veículo não pertence ao motorista');
    }

    const dataAgendada = new Date(dto.dataHoraAgendada);
    if (isNaN(dataAgendada.getTime())) throw new BadRequestException('Data inválida');

    const codigo = CryptoUtil.generateShortId();
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${codigo}`;

    const agendamento = this.agendamentoRepo.create({
      codigo,
      empresaId: doca.unidade.empresaId,
      docaId: doca.id,
      motoristaId,
      veiculoId: veiculo.id,
      dataHoraAgendada: dataAgendada,
      volumeTon: dto.volumeTon,
      status: StatusAgendamento.AGENDADO,
      qrCodeUrl,
      observacoes: dto.observacoes,
    });

    const saved = await this.agendamentoRepo.save(agendamento);

    // Save history
    await this.historicoRepo.save({
      agendamentoId: saved.id,
      status: saved.status,
    });

    this.gateway.emitNovoAgendamento(saved.empresaId, saved);

    // TODO: Emit alerta capacidade if reaching 80%

    return saved;
  }

  async findByMotorista(motoristaId: string) {
    return this.agendamentoRepo.find({
      where: { motoristaId },
      relations: { doca: { unidade: true }, veiculo: true },
      order: { dataHoraAgendada: 'DESC' },
    });
  }

  async findAllByEmpresa(empresaId: string, filtro: FiltroAgendamentosDto) {
    const qb = this.agendamentoRepo.createQueryBuilder('a')
      .leftJoinAndSelect('a.doca', 'doca')
      .leftJoinAndSelect('a.motorista', 'motorista')
      .leftJoinAndSelect('a.veiculo', 'veiculo')
      .where('a.empresaId = :empresaId', { empresaId });

    if (filtro.status) {
      qb.andWhere('a.status = :status', { status: filtro.status });
    }
    if (filtro.docaId) {
      qb.andWhere('a.docaId = :docaId', { docaId: filtro.docaId });
    }
    if (filtro.data) {
      const start = new Date(filtro.data + 'T00:00:00');
      const end = new Date(filtro.data + 'T23:59:59');
      qb.andWhere('a.dataHoraAgendada BETWEEN :start AND :end', { start, end });
    }

    const page = filtro.page || 1;
    const limit = filtro.limit || 20;
    qb.skip((page - 1) * limit).take(limit);
    qb.orderBy('a.dataHoraAgendada', 'ASC');

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async findOne(id: string, user: any) {
    const a = await this.agendamentoRepo.findOne({
      where: { id },
      relations: { doca: true, motorista: true, veiculo: true, historico: true },
    });

    if (!a) throw new NotFoundException('Agendamento não encontrado');

    if (user.tipo === 'empresa' && a.empresaId !== user.empresaId) {
      throw new ForbiddenException('Acesso negado');
    }
    if (user.tipo === 'motorista' && a.motoristaId !== user.userId) {
      throw new ForbiddenException('Acesso negado');
    }

    return a;
  }

  async findByQrCode(empresaId: string, codigo: string) {
    const a = await this.agendamentoRepo.findOne({
      where: { codigo, empresaId },
      relations: { doca: true, motorista: true, veiculo: true },
    });
    if (!a) throw new NotFoundException('Agendamento não encontrado ou não pertence a esta empresa');
    return a;
  }

  async updateStatus(id: string, status: StatusAgendamento, operadorId?: string, isCancelMotorista?: boolean) {
    const a = await this.agendamentoRepo.findOne({ where: { id } });
    if (!a) throw new NotFoundException('Agendamento não encontrado');

    a.status = status;
    await this.agendamentoRepo.save(a);

    await this.historicoRepo.save({
      agendamentoId: a.id,
      status,
      operadorId,
    });

    this.gateway.emitStatusAgendamento(a.empresaId, a);

    // Se finalizou, poderíamos atualizar score do motorista
    // Se cancelou, log

    return a;
  }
}
