import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Empresa } from './empresa.entity';
import { Doca } from './doca.entity';

@Entity('unidades')
export class Unidade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  cidade: string;

  @Column()
  estado: string;

  @Column()
  endereco: string;

  @Column({ default: true })
  ativa: boolean;

  @ManyToOne(() => Empresa, (empresa) => empresa.unidades, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'empresaId' })
  empresa: Empresa;

  @Column()
  empresaId: string;

  @OneToMany(() => Doca, (doca) => doca.unidade)
  docas: Doca[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
