import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Agendamento } from '../entities/agendamento.entity';
import { StatusAgendamento } from '../common/enums/status-agendamento.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Agendamento)
    private agendamentoRepo: Repository<Agendamento>,
  ) {}

  async getDashboardHoje(empresaId: string) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const fimHoje = new Date();
    fimHoje.setHours(23, 59, 59, 999);

    const agendamentos = await this.agendamentoRepo.find({
      where: {
        empresaId,
        dataHoraAgendada: Between(hoje, fimHoje),
      },
      relations: { veiculo: true, motorista: true, doca: true },
      order: { dataHoraAgendada: 'ASC' },
    });

    const totais = {
      totalAgendados: agendamentos.filter((a) => a.status === StatusAgendamento.AGENDADO).length,
      emPatio: agendamentos.filter((a) => a.status === StatusAgendamento.EM_PATIO).length,
      descarregando: agendamentos.filter((a) => a.status === StatusAgendamento.DESCARREGANDO).length,
      concluidos: agendamentos.filter((a) => a.status === StatusAgendamento.CONCLUIDO).length,
      cancelados: agendamentos.filter((a) => a.status === StatusAgendamento.CANCELADO).length,
    };

    const proximasChegadas = agendamentos
      .filter((a) => a.status === StatusAgendamento.AGENDADO && a.dataHoraAgendada >= new Date())
      .slice(0, 5);

    return { totais, proximasChegadas };
  }

  async getFluxoHora(empresaId: string, dataStr: string) {
    const data = dataStr ? new Date(dataStr + 'T00:00:00') : new Date();
    data.setHours(0, 0, 0, 0);
    const fimDia = new Date(data);
    fimDia.setHours(23, 59, 59, 999);

    const agendamentos = await this.agendamentoRepo.find({
      where: {
        empresaId,
        dataHoraAgendada: Between(data, fimDia),
      },
    });

    const fluxo = Array(24).fill(0);
    for (const a of agendamentos) {
      if (a.status !== StatusAgendamento.CANCELADO) {
        const hora = a.dataHoraAgendada.getHours();
        fluxo[hora] += Number(a.volumeTon);
      }
    }

    return fluxo;
  }

  async getRelatorio(empresaId: string, inicioStr: string, fimStr: string) {
    const inicio = new Date(inicioStr + 'T00:00:00');
    const fim = new Date(fimStr + 'T23:59:59');

    const agendamentos = await this.agendamentoRepo.find({
      where: {
        empresaId,
        dataHoraAgendada: Between(inicio, fim),
        status: StatusAgendamento.CONCLUIDO,
      },
    });

    let tonelasProcessadas = 0;
    for (const a of agendamentos) {
      tonelasProcessadas += Number(a.volumeTon);
    }

    const co2Economizado = tonelasProcessadas * 2.68; // 2.68 kg por tonelada
    const economiaFrete = tonelasProcessadas * 15; // Exemplo: R$ 15 por tonelada de economia

    return {
      totalCaminhoes: agendamentos.length,
      tonelasProcessadas,
      tempoMedioDescargaMin: 45, // Fictício por enquanto, exigiria calculo entre checkin e finalizar
      co2Economizado,
      economiaFrete,
    };
  }
}
