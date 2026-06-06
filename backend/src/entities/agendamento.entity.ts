import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Empresa } from './empresa.entity';
import { Doca } from './doca.entity';
import { Motorista } from './motorista.entity';
import { Veiculo } from './veiculo.entity';
import { StatusAgendamento } from '../common/enums/status-agendamento.enum';
import { HistoricoStatusAgendamento } from './historico-status-agendamento.entity';

@Entity('agendamentos')
export class Agendamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  codigo: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresaId' })
  empresa: Empresa;

  @Column()
  empresaId: string;

  @ManyToOne(() => Doca, (doca) => doca.agendamentos)
  @JoinColumn({ name: 'docaId' })
  doca: Doca;

  @Column()
  docaId: string;

  @ManyToOne(() => Motorista, (motorista) => motorista.agendamentos)
  @JoinColumn({ name: 'motoristaId' })
  motorista: Motorista;

  @Column()
  motoristaId: string;

  @ManyToOne(() => Veiculo, (veiculo) => veiculo.agendamentos)
  @JoinColumn({ name: 'veiculoId' })
  veiculo: Veiculo;

  @Column()
  veiculoId: string;

  @Column({ type: 'timestamp' })
  dataHoraAgendada: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  volumeTon: number;

  @Column({ type: 'enum', enum: StatusAgendamento, default: StatusAgendamento.AGENDADO })
  status: StatusAgendamento;

  @Column({ nullable: true })
  qrCodeUrl: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @OneToMany(() => HistoricoStatusAgendamento, (historico) => historico.agendamento)
  historico: HistoricoStatusAgendamento[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
