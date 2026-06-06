import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Motorista } from './motorista.entity';
import { Agendamento } from './agendamento.entity';

@Entity('veiculos')
export class Veiculo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  placa: string;

  @Column()
  tipo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  capacidadeTon: number;

  @ManyToOne(() => Motorista, (motorista) => motorista.veiculos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'motoristaId' })
  motorista: Motorista;

  @Column()
  motoristaId: string;

  @OneToMany(() => Agendamento, (agendamento) => agendamento.veiculo)
  agendamentos: Agendamento[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
