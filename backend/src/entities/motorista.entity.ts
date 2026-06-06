import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Veiculo } from './veiculo.entity';
import { Agendamento } from './agendamento.entity';

@Entity('motoristas')
export class Motorista {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  nome: string;

  @Column({ unique: true })
  telefone: string;

  @Column({ nullable: true })
  cnh: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100 })
  scorepontualidade: number;

  @OneToMany(() => Veiculo, (veiculo) => veiculo.motorista)
  veiculos: Veiculo[];

  @OneToMany(() => Agendamento, (agendamento) => agendamento.motorista)
  agendamentos: Agendamento[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
