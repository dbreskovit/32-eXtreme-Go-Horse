import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusAgendamento } from '../../common/enums/status-agendamento.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FiltroAgendamentosDto extends PaginationDto {
  @ApiPropertyOptional({ enum: StatusAgendamento })
  @IsOptional()
  @IsEnum(StatusAgendamento)
  status?: StatusAgendamento;

  @ApiPropertyOptional({ description: 'Data YYYY-MM-DD' })
  @IsOptional()
  @IsString()
  data?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  docaId?: string;
}
