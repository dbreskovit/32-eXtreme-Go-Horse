import { Controller, Get, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MotoristasService } from './motoristas.service';
import { UpdateMotoristaDto } from './dto/update-motorista.dto';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { MotoristaAuthGuard } from '../auth/guards/motorista-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Motoristas')
@ApiBearerAuth()
@UseGuards(MotoristaAuthGuard)
@Controller('motoristas/me')
export class MotoristasController {
  constructor(private readonly motoristasService: MotoristasService) {}

  @Get()
  @ApiOperation({ summary: 'Perfil do motorista' })
  getMe(@CurrentUser() user: any) {
    return this.motoristasService.getMe(user.userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Atualiza perfil' })
  updateMe(@CurrentUser() user: any, @Body() dto: UpdateMotoristaDto) {
    return this.motoristasService.updateMe(user.userId, dto);
  }

  @Get('veiculos')
  @ApiOperation({ summary: 'Lista veículos do motorista' })
  getVeiculos(@CurrentUser() user: any) {
    return this.motoristasService.getVeiculos(user.userId);
  }

  @Post('veiculos')
  @ApiOperation({ summary: 'Cadastra veículo' })
  createVeiculo(@CurrentUser() user: any, @Body() dto: CreateVeiculoDto) {
    return this.motoristasService.createVeiculo(user.userId, dto);
  }
}
