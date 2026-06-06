import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateDocaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tipoCarga: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  capacidadeTonHora: number;
}
