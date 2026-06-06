import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PlanosService } from './planos.service';

@ApiTags('Planos')
@Controller('planos')
export class PlanosController {
  constructor(private readonly planosService: PlanosService) {}

  @Get()
  @ApiOperation({ summary: 'Lista planos disponíveis (público)' })
  findAll() {
    return this.planosService.findAll();
  }
}
