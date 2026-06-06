import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Agendamento } from './agendamento.entity';
import { StatusAgendamento } from '../common/enums/status-agendamento.enum';

@Entity('historico_status_agendamento')
export class HistoricoStatusAgendamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Agendamento, (agendamento) => agendamento.historico, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agendamentoId' })
  agendamento: Agendamento;

  @Column()
  agendamentoId: string;

  @Column({ type: 'enum', enum: StatusAgendamento })
  status: StatusAgendamento;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ nullable: true })
  operadorId: string;

  @CreateDateColumn()
  createdAt: Date;
}
