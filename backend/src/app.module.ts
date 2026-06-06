import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { PlanosModule } from './planos/planos.module';
import { EmpresaModule } from './empresa/empresa.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { UnidadesModule } from './unidades/unidades.module';
import { DocasModule } from './docas/docas.module';
import { SlotsModule } from './slots/slots.module';
import { MotoristasModule } from './motoristas/motoristas.module';
import { AgendamentosModule } from './agendamentos/agendamentos.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.getOrThrow<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: config.get('NODE_ENV') !== 'production',
        ssl:
          config.get('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    AuthModule,
    PlanosModule,
    EmpresaModule,
    UsuariosModule,
    UnidadesModule,
    DocasModule,
    SlotsModule,
    MotoristasModule,
    AgendamentosModule,
    DashboardModule,
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
