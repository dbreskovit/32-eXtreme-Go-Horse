import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginMotoristaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  telefone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  placa: string;
}
