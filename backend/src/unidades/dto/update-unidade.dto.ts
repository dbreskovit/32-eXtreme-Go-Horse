import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUnidadeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cidade?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  endereco?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  ativa?: boolean;
}
