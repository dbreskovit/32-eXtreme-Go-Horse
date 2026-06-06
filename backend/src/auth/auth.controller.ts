import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterEmpresaDto } from './dto/register-empresa.dto';
import { LoginEmpresaDto } from './dto/login-empresa.dto';
import { LoginMotoristaDto } from './dto/login-motorista.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('empresa/register')
  @ApiOperation({ summary: 'Cria empresa + primeiro usuário gerente' })
  registerEmpresa(@Body() dto: RegisterEmpresaDto) {
    return this.authService.registerEmpresa(dto);
  }

  @Post('empresa/login')
  @ApiOperation({ summary: 'Login do painel (gerente/operador)' })
  loginEmpresa(@Body() dto: LoginEmpresaDto) {
    return this.authService.loginEmpresa(dto);
  }

  @Post('motorista/login')
  @ApiOperation({ summary: 'Login do motorista (telefone + placa)' })
  loginMotorista(@Body() dto: LoginMotoristaDto) {
    return this.authService.loginMotorista(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Dados do usuário logado' })
  getMe(@CurrentUser() user: any) {
    if (user.tipo === 'empresa') {
      return this.authService.getMeEmpresa(user.userId);
    }
    return this.authService.getMeMotorista(user.userId);
  }
}
