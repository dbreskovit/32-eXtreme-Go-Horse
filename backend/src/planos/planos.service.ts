import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plano } from '../entities/plano.entity';

@Injectable()
export class PlanosService implements OnModuleInit {
  constructor(
    @InjectRepository(Plano)
    private planosRepo: Repository<Plano>,
  ) {}

  async onModuleInit() {
    await this.seedPlanos();
  }

  private async seedPlanos() {
    const count = await this.planosRepo.count();
    if (count === 0) {
      await this.planosRepo.save([
        { nome: 'Gratuito', maxUnidades: 1, precoMensal: 0, ativo: true },
        { nome: 'Regional', maxUnidades: 5, precoMensal: 499.9, ativo: true },
        { nome: 'Enterprise', maxUnidades: 999, precoMensal: 1499.9, ativo: true },
      ]);
      console.log('✅ Planos padrão criados com sucesso.');
    }
  }

  async findAll() {
    return this.planosRepo.find({ where: { ativo: true } });
  }
}
