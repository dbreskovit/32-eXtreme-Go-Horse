import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SlotsService } from './slots.service';

@ApiTags('Slots')
@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get()
  @ApiOperation({ summary: 'Grade de slots disponíveis (público)' })
  @ApiQuery({ name: 'docaId', required: true, type: String })
  @ApiQuery({ name: 'data', required: true, type: String, example: '2023-10-15' })
  getSlots(@Query('docaId') docaId: string, @Query('data') data: string) {
    return this.slotsService.getSlots(docaId, data);
  }
}
