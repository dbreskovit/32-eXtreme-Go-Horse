import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUnidadeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cidade: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  estado: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endereco: string;
}
