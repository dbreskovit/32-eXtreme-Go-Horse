import { Controller, Get, Post, Patch, Delete, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DocasService } from './docas.service';
import { CreateDocaDto } from './dto/create-doca.dto';
import { UpdateDocaDto } from './dto/update-doca.dto';
import { UpdateHorariosDto } from './dto/update-horarios.dto';
import { EmpresaAuthGuard } from '../auth/guards/empresa-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Docas')
@ApiBearerAuth()
@UseGuards(EmpresaAuthGuard)
@Controller()
export class DocasController {
  constructor(private readonly docasService: DocasService) {}

  @Get('unidades/:unidadeId/docas')
  @ApiOperation({ summary: 'Lista docas de uma unidade' })
  findAll(@CurrentUser() user: any, @Param('unidadeId') unidadeId: string) {
    return this.docasService.findAll(user.empresaId, unidadeId);
  }

  @Post('unidades/:unidadeId/docas')
  @ApiOperation({ summary: 'Cria doca' })
  create(@CurrentUser() user: any, @Param('unidadeId') unidadeId: string, @Body() dto: CreateDocaDto) {
    return this.docasService.create(user.empresaId, unidadeId, dto);
  }

  @Patch('docas/:id')
  @ApiOperation({ summary: 'Atualiza doca' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateDocaDto) {
    return this.docasService.update(user.empresaId, id, dto);
  }

  @Delete('docas/:id')
  @ApiOperation({ summary: 'Remove doca' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.docasService.remove(user.empresaId, id);
  }

  @Put('docas/:id/horarios')
  @ApiOperation({ summary: 'Define horários de operação (bulk)' })
  updateHorarios(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateHorariosDto) {
    return this.docasService.updateHorarios(user.empresaId, id, dto);
  }
}
