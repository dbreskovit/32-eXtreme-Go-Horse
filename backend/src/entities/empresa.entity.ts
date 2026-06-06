import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Plano } from './plano.entity';
import { UsuarioEmpresa } from './usuario-empresa.entity';
import { Unidade } from './unidade.entity';

@Entity('empresas')
export class Empresa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  razaoSocial: string;

  @Column({ unique: true })
  cnpj: string;

  @Column({ unique: true })
  email: string;

  @Column()
  telefone: string;

  @Column({ default: true })
  ativo: boolean;

  @Column({ default: false })
  assinaturaAtiva: boolean;

  @Column({ type: 'timestamp', nullable: true })
  assinaturaExpiraEm: Date;

  @ManyToOne(() => Plano)
  @JoinColumn({ name: 'planoId' })
  plano: Plano;

  @Column({ nullable: true })
  planoId: string;

  @OneToMany(() => UsuarioEmpresa, (usuario) => usuario.empresa)
  usuarios: UsuarioEmpresa[];

  @OneToMany(() => Unidade, (unidade) => unidade.empresa)
  unidades: Unidade[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
