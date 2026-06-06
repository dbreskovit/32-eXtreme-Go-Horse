import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEmpresa } from '../entities/usuario-empresa.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CryptoUtil } from '../utils/crypto.util';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(UsuarioEmpresa)
    private usuarioRepo: Repository<UsuarioEmpresa>,
  ) {}

  async findAll(empresaId: string) {
    return this.usuarioRepo.find({
      where: { empresaId },
      select: { id: true, nome: true, email: true, papel: true, ativo: true, createdAt: true },
    });
  }

  async create(empresaId: string, dto: CreateUsuarioDto) {
    const existe = await this.usuarioRepo.findOne({ where: { email: dto.email } });
    if (existe) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const usuario = this.usuarioRepo.create({
      nome: dto.nome,
      email: dto.email,
      senhaHash: CryptoUtil.hashPassword(dto.senha),
      papel: dto.papel,
      empresaId,
    });
    const saved = await this.usuarioRepo.save(usuario);
    saved.senhaHash = undefined as any;
    return saved;
  }

  async update(empresaId: string, id: string, dto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepo.findOne({ where: { id, empresaId } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    await this.usuarioRepo.update(id, dto);
    return this.usuarioRepo.findOne({
      where: { id },
      select: { id: true, nome: true, email: true, papel: true, ativo: true },
    });
  }

  async remove(empresaId: string, id: string) {
    const usuario = await this.usuarioRepo.findOne({ where: { id, empresaId } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    await this.usuarioRepo.remove(usuario);
    return { success: true };
  }
}
