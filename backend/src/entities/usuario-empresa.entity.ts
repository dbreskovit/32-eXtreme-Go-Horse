import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Empresa } from './empresa.entity';
import { PapelUsuario } from '../common/enums/roles.enum';

@Entity('usuarios_empresa')
export class UsuarioEmpresa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senhaHash: string;

  @Column({ type: 'enum', enum: PapelUsuario, default: PapelUsuario.OPERADOR })
  papel: PapelUsuario;

  @Column({ default: true })
  ativo: boolean;

  @ManyToOne(() => Empresa, (empresa) => empresa.usuarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'empresaId' })
  empresa: Empresa;

  @Column()
  empresaId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
