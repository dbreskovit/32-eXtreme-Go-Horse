import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AgendamentosService } from './agendamentos.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { FiltroAgendamentosDto } from './dto/filtro-agendamentos.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmpresaAuthGuard } from '../auth/guards/empresa-auth.guard';
import { MotoristaAuthGuard } from '../auth/guards/motorista-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { StatusAgendamento } from '../common/enums/status-agendamento.enum';

@ApiTags('Agendamentos')
@ApiBearerAuth()
@Controller('agendamentos')
export class AgendamentosController {
  constructor(private readonly agendamentosService: AgendamentosService) {}

  @Post()
  @UseGuards(MotoristaAuthGuard)
  @ApiOperation({ summary: 'Motorista cria agendamento' })
  create(@CurrentUser() user: any, @Body() dto: CreateAgendamentoDto) {
    return this.agendamentosService.create(user.userId, dto);
  }

  @Get('me')
  @UseGuards(MotoristaAuthGuard)
  @ApiOperation({ summary: 'Agendamentos do motorista logado' })
  findMe(@CurrentUser() user: any) {
    return this.agendamentosService.findByMotorista(user.userId);
  }

  @Get()
  @UseGuards(EmpresaAuthGuard)
  @ApiOperation({ summary: 'Todos os agendamentos da empresa (operador)' })
  findAllByEmpresa(@CurrentUser() user: any, @Query() filtro: FiltroAgendamentosDto) {
    return this.agendamentosService.findAllByEmpresa(user.empresaId, filtro);
  }

  @Get('qr/:codigo')
  @UseGuards(EmpresaAuthGuard)
  @ApiOperation({ summary: 'Valida QR code na guarita' })
  findByQrCode(@CurrentUser() user: any, @Param('codigo') codigo: string) {
    return this.agendamentosService.findByQrCode(user.empresaId, codigo);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Detalhe de um agendamento' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.agendamentosService.findOne(id, user);
  }

  @Patch(':id/checkin')
  @UseGuards(EmpresaAuthGuard)
  @ApiOperation({ summary: 'Operador: caminhão entrou no pátio' })
  checkin(@CurrentUser() user: any, @Param('id') id: string) {
    return this.agendamentosService.updateStatus(id, StatusAgendamento.EM_PATIO, user.userId);
  }

  @Patch(':id/descarregando')
  @UseGuards(EmpresaAuthGuard)
  @ApiOperation({ summary: 'Operador: iniciou descarga' })
  descarregando(@CurrentUser() user: any, @Param('id') id: string) {
    return this.agendamentosService.updateStatus(id, StatusAgendamento.DESCARREGANDO, user.userId);
  }

  @Patch(':id/finalizar')
  @UseGuards(EmpresaAuthGuard)
  @ApiOperation({ summary: 'Operador: descarga concluída' })
  finalizar(@CurrentUser() user: any, @Param('id') id: string) {
    return this.agendamentosService.updateStatus(id, StatusAgendamento.CONCLUIDO, user.userId);
  }

  @Patch(':id/cancelar')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Motorista ou operador cancela' })
  async cancelar(@CurrentUser() user: any, @Param('id') id: string) {
    const agend = await this.agendamentosService.findOne(id, user);
    if (agend.status === StatusAgendamento.CONCLUIDO || agend.status === StatusAgendamento.CANCELADO) {
      throw new BadRequestException('Não é possível cancelar no status atual');
    }
    const isOperador = user.tipo === 'empresa';
    return this.agendamentosService.updateStatus(id, StatusAgendamento.CANCELADO, isOperador ? user.userId : null);
  }
}
