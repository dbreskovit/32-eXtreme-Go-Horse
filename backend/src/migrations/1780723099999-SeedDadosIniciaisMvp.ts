import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: Dados iniciais para MVP
 *
 * Cria a empresa padrão (Empresa XPTO), 2 usuários (gerente + operador),
 * 2 unidades e 5 docas. Usa ON CONFLICT DO NOTHING para ser idempotente.
 *
 * Credenciais:
 *   Gerente  → carlos@empresaxpto.com.br / senha123
 *   Operador → guarita@empresaxpto.com.br / senha123
 *   Motorista→ qualquer telefone + placa (auto-cadastrado no login)
 *
 * Hash de "senha123" com salt fixo (crypto.scryptSync, 64 bytes):
 *   salt = fluxograo2026mvpsalt0000000000ab
 */
const SENHA_HASH =
  'fluxograo2026mvpsalt0000000000ab:ccaccff4a09f13b9d4c55ec73609dfef73c93282c03bc6c7496a99ae0802a2f7e46ae30e39ebacf625cd49ceec6026dd8fedf757e2adb1050b43bc1cd1c79383';

const EMPRESA_ID = '00000000-0000-0000-0000-000000000001';
const GERENTE_ID = '00000000-0000-0000-0000-000000000002';
const OPERADOR_ID = '00000000-0000-0000-0000-000000000003';
const UNI1_ID = '00000000-0000-0000-0000-000000000010';
const UNI2_ID = '00000000-0000-0000-0000-000000000011';
const DOCA1_ID = '00000000-0000-0000-0000-000000000020';
const DOCA2_ID = '00000000-0000-0000-0000-000000000021';
const DOCA3_ID = '00000000-0000-0000-0000-000000000022';
const DOCA4_ID = '00000000-0000-0000-0000-000000000023';
const DOCA5_ID = '00000000-0000-0000-0000-000000000024';

export class SeedDadosIniciaisMvp1780723099999 implements MigrationInterface {
  name = 'SeedDadosIniciaisMvp1780723099999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Empresa padrão ──────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO empresas (id, "razaoSocial", cnpj, email, telefone, ativo, "assinaturaAtiva", "createdAt", "updatedAt")
      VALUES (
        '${EMPRESA_ID}',
        'Logística XPTO S.A.',
        '12.345.678/0001-90',
        'operacoes@empresaxpto.com.br',
        '(55) 3522-1234',
        true,
        true,
        NOW(),
        NOW()
      )
      ON CONFLICT (cnpj) DO NOTHING;
    `);

    // ── Usuário gerente ─────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO usuarios_empresa (id, nome, email, "senhaHash", papel, ativo, "empresaId", "createdAt", "updatedAt")
      VALUES (
        '${GERENTE_ID}',
        'Carlos Henrique',
        'carlos@empresaxpto.com.br',
        '${SENHA_HASH}',
        'gerente',
        true,
        '${EMPRESA_ID}',
        NOW(),
        NOW()
      )
      ON CONFLICT (email) DO NOTHING;
    `);

    // ── Usuário operador de guarita ─────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO usuarios_empresa (id, nome, email, "senhaHash", papel, ativo, "empresaId", "createdAt", "updatedAt")
      VALUES (
        '${OPERADOR_ID}',
        'Ana Guarita',
        'guarita@empresaxpto.com.br',
        '${SENHA_HASH}',
        'operador',
        true,
        '${EMPRESA_ID}',
        NOW(),
        NOW()
      )
      ON CONFLICT (email) DO NOTHING;
    `);

    // ── Unidade 1: Silo Matriz ──────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO unidades (id, nome, cidade, estado, endereco, ativa, "empresaId", "createdAt", "updatedAt")
      VALUES (
        '${UNI1_ID}',
        'Silo Matriz — XPTO',
        'Cidade XPTO',
        'RS',
        'RS-155, Km 42',
        true,
        '${EMPRESA_ID}',
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO NOTHING;
    `);

    // ── Unidade 2: Filial ───────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO unidades (id, nome, cidade, estado, endereco, ativa, "empresaId", "createdAt", "updatedAt")
      VALUES (
        '${UNI2_ID}',
        'Filial — XPTO 2',
        'Cidade XPTO 2',
        'RS',
        'Av. Brasil, 800',
        true,
        '${EMPRESA_ID}',
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO NOTHING;
    `);

    // ── Docas da Unidade 1 ──────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO docas (id, nome, "tipoCarga", "capacidadeTonHora", ativa, "unidadeId", "createdAt", "updatedAt")
      VALUES
        ('${DOCA1_ID}', 'Doca 1 — Soja',  'Soja',  120, true,  '${UNI1_ID}', NOW(), NOW()),
        ('${DOCA2_ID}', 'Doca 2 — Milho', 'Milho', 100, true,  '${UNI1_ID}', NOW(), NOW()),
        ('${DOCA3_ID}', 'Doca 3 — Trigo', 'Trigo', 80,  false, '${UNI1_ID}', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `);

    // ── Docas da Unidade 2 ──────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO docas (id, nome, "tipoCarga", "capacidadeTonHora", ativa, "unidadeId", "createdAt", "updatedAt")
      VALUES
        ('${DOCA4_ID}', 'Doca 1 — Soja/Milho', 'Soja/Milho', 110, true, '${UNI2_ID}', NOW(), NOW()),
        ('${DOCA5_ID}', 'Doca 2 — Trigo',      'Trigo',       70, true, '${UNI2_ID}', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove apenas dados inseridos por esta migration (na ordem correta por FK)
    await queryRunner.query(`DELETE FROM docas WHERE id IN ('${DOCA1_ID}','${DOCA2_ID}','${DOCA3_ID}','${DOCA4_ID}','${DOCA5_ID}')`);
    await queryRunner.query(`DELETE FROM unidades WHERE id IN ('${UNI1_ID}','${UNI2_ID}')`);
    await queryRunner.query(`DELETE FROM usuarios_empresa WHERE id IN ('${GERENTE_ID}','${OPERADOR_ID}')`);
    await queryRunner.query(`DELETE FROM empresas WHERE id = '${EMPRESA_ID}'`);
  }
}
