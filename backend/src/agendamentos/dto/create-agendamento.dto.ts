import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAgendamentoDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  docaId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  veiculoId: string;

  @ApiProperty({ description: 'Formato YYYY-MM-DDTHH:mm:ssZ' })
  @IsString()
  @IsNotEmpty()
  dataHoraAgendada: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  volumeTon: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observacoes?: string;
}
