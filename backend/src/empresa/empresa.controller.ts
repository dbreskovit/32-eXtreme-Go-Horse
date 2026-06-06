import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EmpresaService } from './empresa.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { EmpresaAuthGuard } from '../auth/guards/empresa-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Empresa')
@ApiBearerAuth()
@UseGuards(EmpresaAuthGuard)
@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Get('me')
  @ApiOperation({ summary: 'Dados da empresa do tenant logado' })
  getMe(@CurrentUser() user: any) {
    return this.empresaService.getMe(user.empresaId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualiza dados da empresa' })
  updateMe(@CurrentUser() user: any, @Body() dto: UpdateEmpresaDto) {
    return this.empresaService.updateMe(user.empresaId, dto);
  }
}
