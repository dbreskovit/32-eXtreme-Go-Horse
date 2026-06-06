import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from '../entities/empresa.entity';
import { UsuarioEmpresa } from '../entities/usuario-empresa.entity';
import { Motorista } from '../entities/motorista.entity';
import { Veiculo } from '../entities/veiculo.entity';
import { RegisterEmpresaDto } from './dto/register-empresa.dto';
import { LoginEmpresaDto } from './dto/login-empresa.dto';
import { LoginMotoristaDto } from './dto/login-motorista.dto';
import { CryptoUtil } from '../utils/crypto.util';
import { PapelUsuario } from '../common/enums/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Empresa)
    private empresaRepo: Repository<Empresa>,
    @InjectRepository(UsuarioEmpresa)
    private usuarioRepo: Repository<UsuarioEmpresa>,
    @InjectRepository(Motorista)
    private motoristaRepo: Repository<Motorista>,
    @InjectRepository(Veiculo)
    private veiculoRepo: Repository<Veiculo>,
    private jwtService: JwtService,
  ) {}

  async registerEmpresa(dto: RegisterEmpresaDto) {
    const empresaExiste = await this.empresaRepo.findOne({
      where: [{ cnpj: dto.cnpj }, { email: dto.email }],
    });
    if (empresaExiste) {
      throw new ConflictException('Empresa já cadastrada com este CNPJ ou Email');
    }

    const usuarioExiste = await this.usuarioRepo.findOne({ where: { email: dto.email } });
    if (usuarioExiste) {
      throw new ConflictException('E-mail de gerente já está em uso');
    }

    const empresa = this.empresaRepo.create({
      razaoSocial: dto.razaoSocial,
      cnpj: dto.cnpj,
      email: dto.email,
      telefone: dto.telefone,
    });
    const savedEmpresa = await this.empresaRepo.save(empresa);

    const gerente = this.usuarioRepo.create({
      nome: dto.nomeGerente,
      email: dto.email,
      senhaHash: CryptoUtil.hashPassword(dto.senhaGerente),
      papel: PapelUsuario.GERENTE,
      empresaId: savedEmpresa.id,
    });
    await this.usuarioRepo.save(gerente);

    return this.loginEmpresa({ email: dto.email, senha: dto.senhaGerente });
  }

  async loginEmpresa(dto: LoginEmpresaDto) {
    const usuario = await this.usuarioRepo.findOne({ where: { email: dto.email } });
    if (!usuario || !CryptoUtil.verifyPassword(dto.senha, usuario.senhaHash)) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!usuario.ativo) {
      throw new UnauthorizedException('Usuário inativo');
    }

    const payload = { sub: usuario.id, tipo: 'empresa', empresaId: usuario.empresaId, papel: usuario.papel };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginMotorista(dto: LoginMotoristaDto) {
    let motorista = await this.motoristaRepo.findOne({ where: { telefone: dto.telefone } });
    if (!motorista) {
      motorista = this.motoristaRepo.create({ telefone: dto.telefone });
      motorista = await this.motoristaRepo.save(motorista);
    }

    let veiculo = await this.veiculoRepo.findOne({ where: { placa: dto.placa } });
    if (!veiculo) {
      veiculo = this.veiculoRepo.create({
        placa: dto.placa,
        tipo: 'Desconhecido',
        capacidadeTon: 0,
        motoristaId: motorista.id,
      });
      await this.veiculoRepo.save(veiculo);
    } else if (veiculo.motoristaId !== motorista.id) {
      veiculo.motoristaId = motorista.id;
      await this.veiculoRepo.save(veiculo);
    }

    const payload = { sub: motorista.id, tipo: 'motorista' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getMeEmpresa(userId: string) {
    return this.usuarioRepo.findOne({
      where: { id: userId },
      select: { id: true, nome: true, email: true, papel: true, ativo: true, empresaId: true },
    });
  }

  async getMeMotorista(userId: string) {
    return this.motoristaRepo.findOne({
      where: { id: userId },
      relations: { veiculos: true },
    });
  }
}
