import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterEmpresaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  razaoSocial: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  telefone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nomeGerente: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  senhaGerente: string;
}
