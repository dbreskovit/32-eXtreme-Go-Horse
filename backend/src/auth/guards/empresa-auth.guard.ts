import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class EmpresaAuthGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new ForbiddenException();
    }
    if (user.tipo !== 'empresa') {
      throw new ForbiddenException('Acesso restrito a usuários de empresas');
    }
    return user;
  }
}
