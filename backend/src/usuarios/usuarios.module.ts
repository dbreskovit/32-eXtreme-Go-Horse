import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { UsuarioEmpresa } from '../entities/usuario-empresa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEmpresa])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
