import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('planos')
export class Plano {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ type: 'int' })
  maxUnidades: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precoMensal: number;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
