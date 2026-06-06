import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateDocaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tipoCarga?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  capacidadeTonHora?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  ativa?: boolean;
}
