import { IsArray, IsInt, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class HorarioDto {
  @ApiProperty({ description: '0 a 6 (0 = Domingo)' })
  @IsInt()
  @Min(0)
  @Max(6)
  diaSemana: number;

  @ApiProperty({ description: 'Formato HH:mm:ss', example: '08:00:00' })
  @IsString()
  horaInicio: string;

  @ApiProperty({ description: 'Formato HH:mm:ss', example: '18:00:00' })
  @IsString()
  horaFim: string;
}

export class UpdateHorariosDto {
  @ApiProperty({ type: [HorarioDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HorarioDto)
  horarios: HorarioDto[];
}
