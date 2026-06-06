import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEmpresaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  razaoSocial?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefone?: string;
}
