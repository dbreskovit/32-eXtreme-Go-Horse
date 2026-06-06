import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not } from 'typeorm';
import { Doca } from '../entities/doca.entity';
import { HorarioOperacao } from '../entities/horario-operacao.entity';
import { Agendamento } from '../entities/agendamento.entity';
import { StatusAgendamento } from '../common/enums/status-agendamento.enum';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Doca)
    private docaRepo: Repository<Doca>,
    @InjectRepository(HorarioOperacao)
    private horarioRepo: Repository<HorarioOperacao>,
    @InjectRepository(Agendamento)
    private agendamentoRepo: Repository<Agendamento>,
  ) {}

  async getSlots(docaId: string, dataStr: string) {
    if (!docaId || !dataStr) {
      throw new BadRequestException('docaId e data são obrigatórios');
    }

    const data = new Date(dataStr + 'T00:00:00'); // YYYY-MM-DD local time base
    if (isNaN(data.getTime())) throw new BadRequestException('Data inválida');

    const doca = await this.docaRepo.findOne({ where: { id: docaId, ativa: true } });
    if (!doca) throw new BadRequestException('Doca inválida ou inativa');

    const diaSemana = data.getDay(); // 0-6
    const horarios = await this.horarioRepo.find({ where: { docaId, diaSemana } });

    if (horarios.length === 0) return [];

    // Busca agendamentos do dia na doca (ignora cancelados)
    const inicioDia = new Date(data);
    const fimDia = new Date(data);
    fimDia.setHours(23, 59, 59, 999);

    const agendamentos = await this.agendamentoRepo.find({
      where: {
        docaId,
        dataHoraAgendada: Between(inicioDia, fimDia),
        status: Not(StatusAgendamento.CANCELADO),
      },
    });

    const slots: any[] = [];

    // Divide os horários de operação em slots de 1 hora
    for (const horario of horarios) {
      let currentHour = parseInt(horario.horaInicio.split(':')[0]);
      const endHourStr = parseInt(horario.horaFim.split(':')[0]);
      // Ajusta para cobrir minutos se for o caso, mas assumindo hora inteira para simplificar

      while (currentHour < endHourStr) {
        const slotInicio = new Date(data);
        slotInicio.setHours(currentHour, 0, 0, 0);

        const slotFim = new Date(data);
        slotFim.setHours(currentHour + 1, 0, 0, 0);

        // Agendamentos que caem neste slot
        const agendamentosNoSlot = agendamentos.filter((a) => {
          const h = a.dataHoraAgendada.getHours();
          return h === currentHour;
        });

        const volumeOcupado = agendamentosNoSlot.reduce((sum, a) => sum + Number(a.volumeTon), 0);
        const capacidadeDisponivel = Number(doca.capacidadeTonHora) - volumeOcupado;

        slots.push({
          horaInicio: `${currentHour.toString().padStart(2, '0')}:00`,
          horaFim: `${(currentHour + 1).toString().padStart(2, '0')}:00`,
          capacidadeDisponivel: Math.max(0, capacidadeDisponivel),
          ocupado: capacidadeDisponivel <= 0,
        });

        currentHour++;
      }
    }

    return slots;
  }
}
