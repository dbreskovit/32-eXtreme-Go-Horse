import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { EmpresaAuthGuard } from '../auth/guards/empresa-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PapelUsuario } from '../common/enums/roles.enum';

@ApiTags('Usuarios (Painel da Empresa)')
@ApiBearerAuth()
@UseGuards(EmpresaAuthGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @ApiOperation({ summary: 'Lista usuários da empresa' })
  findAll(@CurrentUser() user: any) {
    return this.usuariosService.findAll(user.empresaId);
  }

  @Post()
  @ApiOperation({ summary: 'Convida novo operador/gerente' })
  create(@CurrentUser() user: any, @Body() dto: CreateUsuarioDto) {
    if (user.papel !== PapelUsuario.GERENTE) {
      throw new ForbiddenException('Apenas gerentes podem criar usuários');
    }
    return this.usuariosService.create(user.empresaId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza papel/dados' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
    if (user.papel !== PapelUsuario.GERENTE && user.userId !== id) {
      throw new ForbiddenException('Sem permissão para atualizar este usuário');
    }
    return this.usuariosService.update(user.empresaId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove acesso' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    if (user.papel !== PapelUsuario.GERENTE) {
      throw new ForbiddenException('Apenas gerentes podem remover usuários');
    }
    if (user.userId === id) {
      throw new ForbiddenException('Não pode remover a si mesmo');
    }
    return this.usuariosService.remove(user.empresaId, id);
  }
}
