import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class MotoristaAuthGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new ForbiddenException();
    }
    if (user.tipo !== 'motorista') {
      throw new ForbiddenException('Acesso restrito a motoristas');
    }
    return user;
  }
}
