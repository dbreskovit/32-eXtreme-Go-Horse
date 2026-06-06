import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateVeiculoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  placa: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  capacidadeTon: number;
}
