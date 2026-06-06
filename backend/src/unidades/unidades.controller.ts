import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UnidadesService } from './unidades.service';
import { CreateUnidadeDto } from './dto/create-unidade.dto';
import { UpdateUnidadeDto } from './dto/update-unidade.dto';
import { EmpresaAuthGuard } from '../auth/guards/empresa-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Unidades')
@ApiBearerAuth()
@UseGuards(EmpresaAuthGuard)
@Controller('unidades')
export class UnidadesController {
  constructor(private readonly unidadesService: UnidadesService) {}

  @Get()
  @ApiOperation({ summary: 'Lista unidades da empresa (com contagem de docas)' })
  findAll(@CurrentUser() user: any) {
    return this.unidadesService.findAll(user.empresaId);
  }

  @Post()
  @ApiOperation({ summary: 'Cria unidade' })
  create(@CurrentUser() user: any, @Body() dto: CreateUnidadeDto) {
    return this.unidadesService.create(user.empresaId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza unidade' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateUnidadeDto) {
    return this.unidadesService.update(user.empresaId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove unidade' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.unidadesService.remove(user.empresaId, id);
  }
}
