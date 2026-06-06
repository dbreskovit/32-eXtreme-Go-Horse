import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Doca } from './doca.entity';

@Entity('horarios_operacao')
export class HorarioOperacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  diaSemana: number; // 0-6

  @Column({ type: 'time' })
  horaInicio: string;

  @Column({ type: 'time' })
  horaFim: string;

  @ManyToOne(() => Doca, (doca) => doca.horarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'docaId' })
  doca: Doca;

  @Column()
  docaId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
