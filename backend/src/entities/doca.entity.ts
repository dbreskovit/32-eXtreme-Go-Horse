import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Unidade } from './unidade.entity';
import { HorarioOperacao } from './horario-operacao.entity';
import { Agendamento } from './agendamento.entity';

@Entity('docas')
export class Doca {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  tipoCarga: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  capacidadeTonHora: number;

  @Column({ default: true })
  ativa: boolean;

  @ManyToOne(() => Unidade, (unidade) => unidade.docas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'unidadeId' })
  unidade: Unidade;

  @Column()
  unidadeId: string;

  @OneToMany(() => HorarioOperacao, (horario) => horario.doca)
  horarios: HorarioOperacao[];

  @OneToMany(() => Agendamento, (agendamento) => agendamento.doca)
  agendamentos: Agendamento[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
