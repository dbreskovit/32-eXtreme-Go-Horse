import { MigrationInterface, QueryRunner } from 'typeorm';
import * as crypto from 'crypto';

/**
 * Seed de demonstração: empresa, unidades, docas com horários de operação,
 * motoristas (incluindo um motorista padrão com veículo) e agendamentos em
 * vários status para deixar o dashboard populado.
 *
 * Idempotente: usa IDs fixos + ON CONFLICT DO NOTHING. Pode rodar mais de uma vez.
 *
 * Credenciais geradas:
 *   Painel empresa  → email: demo@fluxograo.com   senha: demo1234
 *   Motorista padrão → telefone: 51999990000      placa: DMO1A23
 */
export class SeedDemoData1780800000000 implements MigrationInterface {
  name = 'SeedDemoData1780800000000';

  // ─── IDs fixos ──────────────────────────────────────────────────────────────
  private readonly PLANO = '11111111-1111-4111-8111-111111111111';
  private readonly EMPRESA = '22222222-2222-4222-8222-222222222222';
  private readonly GERENTE = '33333333-3333-4333-8333-333333333333';

  private readonly UNID1 = 'aaaaaaaa-0000-4000-8000-000000000001';
  private readonly UNID2 = 'aaaaaaaa-0000-4000-8000-000000000002';

  private readonly DOCA1 = 'dddddddd-0000-4000-8000-000000000001';
  private readonly DOCA2 = 'dddddddd-0000-4000-8000-000000000002';
  private readonly DOCA3 = 'dddddddd-0000-4000-8000-000000000003';
  private readonly DOCA4 = 'dddddddd-0000-4000-8000-000000000004';
  private readonly DOCA5 = 'dddddddd-0000-4000-8000-000000000005';

  private readonly MOT0 = 'cccccccc-0000-4000-8000-000000000000'; // padrão
  private readonly MOT2 = 'cccccccc-0000-4000-8000-000000000002';
  private readonly MOT3 = 'cccccccc-0000-4000-8000-000000000003';
  private readonly MOT4 = 'cccccccc-0000-4000-8000-000000000004';

  private readonly VEI0 = 'bbbbbbbb-0000-4000-8000-000000000000'; // padrão
  private readonly VEI2 = 'bbbbbbbb-0000-4000-8000-000000000002';
  private readonly VEI3 = 'bbbbbbbb-0000-4000-8000-000000000003';
  private readonly VEI4 = 'bbbbbbbb-0000-4000-8000-000000000004';

  private hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  private qr(codigo: string): string {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${codigo}`;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const senhaHash = this.hashPassword('demo1234');

    // ── Plano ──
    await queryRunner.query(
      `INSERT INTO "planos" ("id", "nome", "maxUnidades", "precoMensal", "ativo")
       VALUES ($1, 'Pro', 10, 299.90, true) ON CONFLICT ("id") DO NOTHING`,
      [this.PLANO],
    );

    // ── Empresa ──
    await queryRunner.query(
      `INSERT INTO "empresas" ("id", "razaoSocial", "cnpj", "email", "telefone", "ativo", "assinaturaAtiva", "assinaturaExpiraEm", "planoId")
       VALUES ($1, 'Cooperativa Agro Demo', '12345678000199', 'demo@fluxograo.com', '5455551000', true, true, NOW() + INTERVAL '1 year', $2)
       ON CONFLICT ("id") DO NOTHING`,
      [this.EMPRESA, this.PLANO],
    );

    // ── Gerente ──
    await queryRunner.query(
      `INSERT INTO "usuarios_empresa" ("id", "nome", "email", "senhaHash", "papel", "ativo", "empresaId")
       VALUES ($1, 'Gerente Demo', 'demo@fluxograo.com', $2, 'gerente', true, $3)
       ON CONFLICT ("id") DO NOTHING`,
      [this.GERENTE, senhaHash, this.EMPRESA],
    );

    // ── Unidades ──
    await queryRunner.query(
      `INSERT INTO "unidades" ("id", "nome", "cidade", "estado", "endereco", "ativa", "empresaId") VALUES
        ($1, 'Filial Passo Fundo', 'Passo Fundo', 'RS', 'BR-285, km 100', true, $3),
        ($2, 'Filial Cruz Alta', 'Cruz Alta', 'RS', 'RS-342, km 12', true, $3)
       ON CONFLICT ("id") DO NOTHING`,
      [this.UNID1, this.UNID2, this.EMPRESA],
    );

    // ── Docas ──
    await queryRunner.query(
      `INSERT INTO "docas" ("id", "nome", "tipoCarga", "capacidadeTonHora", "ativa", "unidadeId") VALUES
        ($1, 'Doca Soja A', 'Soja', 80, true, $6),
        ($2, 'Doca Milho B', 'Milho', 60, true, $6),
        ($3, 'Doca Trigo C', 'Trigo', 50, true, $6),
        ($4, 'Doca Soja A', 'Soja', 70, true, $7),
        ($5, 'Doca Milho B', 'Milho', 55, true, $7)
       ON CONFLICT ("id") DO NOTHING`,
      [this.DOCA1, this.DOCA2, this.DOCA3, this.DOCA4, this.DOCA5, this.UNID1, this.UNID2],
    );

    // ── Horários de operação: todos os dias (0..6), 07:00–19:00, para todas as docas ──
    await queryRunner.query(
      `INSERT INTO "horarios_operacao" ("id", "diaSemana", "horaInicio", "horaFim", "docaId")
       SELECT uuid_generate_v4(), gs.dia, '07:00:00', '19:00:00', d.id
       FROM (VALUES ($1::uuid), ($2::uuid), ($3::uuid), ($4::uuid), ($5::uuid)) AS d(id)
       CROSS JOIN generate_series(0, 6) AS gs(dia)
       WHERE NOT EXISTS (
         SELECT 1 FROM "horarios_operacao" h WHERE h."docaId" = d.id AND h."diaSemana" = gs.dia
       )`,
      [this.DOCA1, this.DOCA2, this.DOCA3, this.DOCA4, this.DOCA5],
    );

    // ── Motoristas (MOT0 = padrão) ──
    await queryRunner.query(
      `INSERT INTO "motoristas" ("id", "nome", "telefone", "cnh", "scorepontualidade") VALUES
        ($1, 'Motorista Demo', '51999990000', '12345678900', 100),
        ($2, 'João Pereira', '51988887777', '22233344455', 95.5),
        ($3, 'Carlos Souza', '54977776666', '33344455566', 88),
        ($4, 'Anderson Lima', '55966665555', '44455566677', 72.5)
       ON CONFLICT ("id") DO NOTHING`,
      [this.MOT0, this.MOT2, this.MOT3, this.MOT4],
    );

    // ── Veículos ──
    await queryRunner.query(
      `INSERT INTO "veiculos" ("id", "placa", "tipo", "capacidadeTon", "motoristaId") VALUES
        ($1, 'DMO1A23', 'Bitrem', 40, $5),
        ($2, 'JPR2B34', 'Carreta', 36, $6),
        ($3, 'CSZ3C45', 'Truck', 14, $7),
        ($4, 'ALM4D56', 'Bitrem', 40, $8)
       ON CONFLICT ("id") DO NOTHING`,
      [this.VEI0, this.VEI2, this.VEI3, this.VEI4, this.MOT0, this.MOT2, this.MOT3, this.MOT4],
    );

    // ── Agendamentos ──
    // Hoje (dataHoraAgendada relativa a CURRENT_DATE) em vários status + concluídos passados.
    const ag = (n: number) => `eeeeeeee-0000-4000-8000-00000000000${n}`;
    await queryRunner.query(
      `INSERT INTO "agendamentos" ("id", "codigo", "empresaId", "docaId", "motoristaId", "veiculoId", "dataHoraAgendada", "volumeTon", "status", "qrCodeUrl", "observacoes") VALUES
        ($1,  'DEMO0001', $20, $13, $15, $16, CURRENT_DATE + INTERVAL '8 hour',  38, 'concluido',     $24, NULL),
        ($2,  'DEMO0002', $20, $13, $17, $18, CURRENT_DATE + INTERVAL '9 hour',  14, 'concluido',     $25, NULL),
        ($3,  'DEMO0003', $20, $14, $21, $22, CURRENT_DATE + INTERVAL '10 hour', 40, 'descarregando', $26, NULL),
        ($4,  'DEMO0004', $20, $14, $11, $12, CURRENT_DATE + INTERVAL '11 hour', 30, 'em_patio',      $27, 'Caminhão no pátio'),
        ($5,  'DEMO0005', $20, $23, $15, $16, CURRENT_DATE + INTERVAL '14 hour', 36, 'agendado',      $28, NULL),
        ($6,  'DEMO0006', $20, $13, $17, $18, CURRENT_DATE + INTERVAL '15 hour', 20, 'agendado',      $29, NULL),
        ($7,  'DEMO0007', $20, $19, $21, $22, CURRENT_DATE + INTERVAL '16 hour', 25, 'agendado',      $30, NULL),
        ($8,  'DEMO0008', $20, $13, $15, $16, CURRENT_DATE + INTERVAL '17 hour', 10, 'cancelado',     $31, 'Cancelado pelo motorista'),
        ($9,  'DEMO0009', $20, $13, $15, $16, CURRENT_DATE - INTERVAL '1 day'  + INTERVAL '9 hour',  40, 'concluido', $32, NULL),
        ($10, 'DEMO0010', $20, $14, $17, $18, CURRENT_DATE - INTERVAL '2 day'  + INTERVAL '10 hour', 55, 'concluido', $33, NULL),
        ($34, 'DEMO0011', $20, $19, $21, $22, CURRENT_DATE - INTERVAL '3 day'  + INTERVAL '8 hour',  60, 'concluido', $35, NULL)
       ON CONFLICT ("id") DO NOTHING`,
      [
        ag(1), ag(2), ag(3), ag(4), ag(5), ag(6), ag(7), ag(8), ag(9), 'eeeeeeee-0000-4000-8000-000000000010',
        this.MOT0, this.VEI0,            // $11, $12
        this.DOCA1, this.DOCA2,          // $13, $14
        this.MOT2, this.VEI2,            // $15, $16
        this.MOT3, this.VEI3,            // $17, $18
        this.DOCA4,                      // $19
        this.EMPRESA,                    // $20
        this.MOT4, this.VEI4,            // $21, $22
        this.DOCA3,                      // $23
        this.qr('DEMO0001'), this.qr('DEMO0002'), this.qr('DEMO0003'), this.qr('DEMO0004'),
        this.qr('DEMO0005'), this.qr('DEMO0006'), this.qr('DEMO0007'), this.qr('DEMO0008'),
        this.qr('DEMO0009'), this.qr('DEMO0010'),
        'eeeeeeee-0000-4000-8000-000000000011', // $34
        this.qr('DEMO0011'),                     // $35
      ],
    );

    // ── Histórico (entrada inicial 'agendado' por agendamento) ──
    await queryRunner.query(
      `INSERT INTO "historico_status_agendamento" ("id", "agendamentoId", "status")
       SELECT uuid_generate_v4(), a.id, 'agendado'
       FROM "agendamentos" a
       WHERE a."empresaId" = $1
         AND NOT EXISTS (SELECT 1 FROM "historico_status_agendamento" h WHERE h."agendamentoId" = a.id)`,
      [this.EMPRESA],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "historico_status_agendamento" WHERE "agendamentoId" IN (SELECT id FROM "agendamentos" WHERE "empresaId" = $1)`,
      [this.EMPRESA],
    );
    await queryRunner.query(`DELETE FROM "agendamentos" WHERE "empresaId" = $1`, [this.EMPRESA]);
    await queryRunner.query(
      `DELETE FROM "veiculos" WHERE "id" IN ($1, $2, $3, $4)`,
      [this.VEI0, this.VEI2, this.VEI3, this.VEI4],
    );
    await queryRunner.query(
      `DELETE FROM "motoristas" WHERE "id" IN ($1, $2, $3, $4)`,
      [this.MOT0, this.MOT2, this.MOT3, this.MOT4],
    );
    await queryRunner.query(
      `DELETE FROM "horarios_operacao" WHERE "docaId" IN ($1, $2, $3, $4, $5)`,
      [this.DOCA1, this.DOCA2, this.DOCA3, this.DOCA4, this.DOCA5],
    );
    await queryRunner.query(`DELETE FROM "docas" WHERE "unidadeId" IN ($1, $2)`, [this.UNID1, this.UNID2]);
    await queryRunner.query(`DELETE FROM "unidades" WHERE "empresaId" = $1`, [this.EMPRESA]);
    await queryRunner.query(`DELETE FROM "usuarios_empresa" WHERE "empresaId" = $1`, [this.EMPRESA]);
    await queryRunner.query(`DELETE FROM "empresas" WHERE "id" = $1`, [this.EMPRESA]);
    await queryRunner.query(`DELETE FROM "planos" WHERE "id" = $1`, [this.PLANO]);
  }
}
