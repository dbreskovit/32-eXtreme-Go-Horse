import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PapelUsuario } from '../../common/enums/roles.enum';

export class CreateUsuarioDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  senha: string;

  @ApiProperty({ enum: PapelUsuario })
  @IsEnum(PapelUsuario)
  papel: PapelUsuario;
}
