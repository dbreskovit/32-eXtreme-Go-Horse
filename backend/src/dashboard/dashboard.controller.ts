import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { EmpresaAuthGuard } from '../auth/guards/empresa-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(EmpresaAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('hoje')
  @ApiOperation({ summary: 'Totais do dia (chegadas, concluídos, em pátio)' })
  getHoje(@CurrentUser() user: any) {
    return this.dashboardService.getDashboardHoje(user.empresaId);
  }

  @Get('fluxo-hora')
  @ApiOperation({ summary: 'Gráfico de agendamentos por hora' })
  @ApiQuery({ name: 'data', required: false, description: 'YYYY-MM-DD' })
  getFluxoHora(@CurrentUser() user: any, @Query('data') data: string) {
    return this.dashboardService.getFluxoHora(user.empresaId, data);
  }

  @Get('relatorio')
  @ApiOperation({ summary: 'Relatório de eficiência + CO2' })
  @ApiQuery({ name: 'inicio', required: true, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'fim', required: true, description: 'YYYY-MM-DD' })
  getRelatorio(
    @CurrentUser() user: any,
    @Query('inicio') inicio: string,
    @Query('fim') fim: string,
  ) {
    return this.dashboardService.getRelatorio(user.empresaId, inicio, fim);
  }
}
