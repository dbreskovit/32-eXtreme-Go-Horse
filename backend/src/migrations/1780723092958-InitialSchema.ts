import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1780723092958 implements MigrationInterface {
    name = 'InitialSchema1780723092958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Idempotente: convive com `synchronize` (que já pode ter criado o schema em dev)
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`DO $$ BEGIN CREATE TYPE "public"."usuarios_empresa_papel_enum" AS ENUM('gerente', 'operador'); EXCEPTION WHEN duplicate_object THEN null; END $$;`);
        await queryRunner.query(`DO $$ BEGIN CREATE TYPE "public"."historico_status_agendamento_status_enum" AS ENUM('agendado', 'em_patio', 'descarregando', 'concluido', 'cancelado'); EXCEPTION WHEN duplicate_object THEN null; END $$;`);
        await queryRunner.query(`DO $$ BEGIN CREATE TYPE "public"."agendamentos_status_enum" AS ENUM('agendado', 'em_patio', 'descarregando', 'concluido', 'cancelado'); EXCEPTION WHEN duplicate_object THEN null; END $$;`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "planos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying NOT NULL, "maxUnidades" integer NOT NULL, "precoMensal" numeric(10,2) NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_683c959790c0f44669997e1a558" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "usuarios_empresa" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying NOT NULL, "email" character varying NOT NULL, "senhaHash" character varying NOT NULL, "papel" "public"."usuarios_empresa_papel_enum" NOT NULL DEFAULT 'operador', "ativo" boolean NOT NULL DEFAULT true, "empresaId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_21fd0e5fcd9207a986071a2b288" UNIQUE ("email"), CONSTRAINT "PK_f7a79f991bd7319aef158bfbd38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "empresas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "razaoSocial" character varying NOT NULL, "cnpj" character varying NOT NULL, "email" character varying NOT NULL, "telefone" character varying NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "assinaturaAtiva" boolean NOT NULL DEFAULT false, "assinaturaExpiraEm" TIMESTAMP, "planoId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f5ed71aeb4ef47f95df5f8830b8" UNIQUE ("cnpj"), CONSTRAINT "UQ_fe5e0374ec6d7d7dfbe04446903" UNIQUE ("email"), CONSTRAINT "PK_ce7b122b37c6499bfd6520873e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "unidades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying NOT NULL, "cidade" character varying NOT NULL, "estado" character varying NOT NULL, "endereco" character varying NOT NULL, "ativa" boolean NOT NULL DEFAULT true, "empresaId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3e728a664b48bbd90a355065233" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "horarios_operacao" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "diaSemana" integer NOT NULL, "horaInicio" TIME NOT NULL, "horaFim" TIME NOT NULL, "docaId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e4a6b446c22cb46d9e0d02b40b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "veiculos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "placa" character varying NOT NULL, "tipo" character varying NOT NULL, "capacidadeTon" numeric(10,2) NOT NULL, "motoristaId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3c7f2de70c4765a04c070a9f745" UNIQUE ("placa"), CONSTRAINT "PK_0c3daa1e5d16914bd9e7777cf77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "motoristas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying, "telefone" character varying NOT NULL, "cnh" character varying, "scorepontualidade" numeric(5,2) NOT NULL DEFAULT '100', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_448716ec3dc320e1783ea9d8f46" UNIQUE ("telefone"), CONSTRAINT "PK_bed77c88836201231df1d9314e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "historico_status_agendamento" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "agendamentoId" uuid NOT NULL, "status" "public"."historico_status_agendamento_status_enum" NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "operadorId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_90f503352a940a354a028c593ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "agendamentos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "codigo" character varying NOT NULL, "empresaId" uuid NOT NULL, "docaId" uuid NOT NULL, "motoristaId" uuid NOT NULL, "veiculoId" uuid NOT NULL, "dataHoraAgendada" TIMESTAMP NOT NULL, "volumeTon" numeric(10,2) NOT NULL, "status" "public"."agendamentos_status_enum" NOT NULL DEFAULT 'agendado', "qrCodeUrl" character varying, "observacoes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_faa9905062bf1a06021852dd825" UNIQUE ("codigo"), CONSTRAINT "PK_3890b7448ebc7efdfd1d43bf0c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "docas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying NOT NULL, "tipoCarga" character varying NOT NULL, "capacidadeTonHora" numeric(10,2) NOT NULL, "ativa" boolean NOT NULL DEFAULT true, "unidadeId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8c5b37789292f22d19754f10f83" PRIMARY KEY ("id"))`);

        await queryRunner.query(`DO $$ BEGIN ALTER TABLE "usuarios_empresa" ADD CONSTRAINT "FK_b551bccbcdee4dad4cb236d9362" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE NO ACTION; EXCEPTION WHEN duplicate_object THEN null; END $$;`);
        await queryRunner.query(`DO $$ BEGIN ALTER TABLE "empresas" ADD CONSTRAINT "FK_59064268f39a070c199321cb621" FOREIGN KEY ("planoId") REFERENCES "planos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION; EXCEPTION WHEN duplicate_object THEN null; END $$;`);
        await queryRunner.query(`DO $$ BEGIN ALTER TABLE "unidades" ADD CONSTRAINT "FK_f396a9a2712244d857b21ca5bdc" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE NO ACTION; EXCEPTION WHEN duplicate_object THEN null; END $$;`);
        await queryRunner.query(`DO $$ BEGIN ALTER TABLE "horarios_operacao" ADD CONSTRAINT "FK_60925e51b44791eab4939c3d6b0" FOREIGN KEY ("docaId") REFERENCES "docas"("id") ON DELETE CASCADE ON UPDATE NO ACTION; EXCEPTION WHEN duplicate_object THEN null; END $$;`);
        await queryRunner.query(`DO $$ BEGIN ALTER TABLE "veiculos" ADD CONSTRAINT "FK_9147d72ce6b1e27aa2625d6b48a" FOREIGN KEY ("motoristaId") REFERENCES "motoristas"("id") ON DELETE CASCADE ON UPDATE NO ACTION; EXCEPTION WHEN duplicate_object THEN null; END $$;`);
        await queryRunner.query(`DO $$ BEGIN ALTER TABLE "historico_status_agendamento" ADD CONSTRAINT "FK_0096fa0fde637449808c00ceee5" FOREIGN KEY ("agendamentoId") REFERENCES "agendamentos"("id") ON DELETE CASCADE ON UPDATE NO ACTION; EXCEPTION WHEN duplicate_object THEN null; END $$;`);
        await queryRunner.query(`DO $$ BEGIN ALTER TABLE "agendamentos" ADD CONSTRAINT "FK_7569f393688e7966bfdb3266340" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION; EXCEPTION WHEN duplicate_object THEN null; END $$;`);
        await queryRunner.query(`DO $$ BEGIN ALTER TABLE "agendamentos" ADD CONSTRAINT "FK_efc6a82d5fb5a0386d67c12c90f" FOREIGN KEY ("docaId") REFERENCES "docas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION; EXCEPTION WHEN duplicate_object THEN null; END $$;`);
        await queryRunner.query(`DO $$ BEGIN ALTER TABLE "agendamentos" ADD CONSTRAINT "FK_6798a4de47db57e2a8412afcbd2" FOREIGN KEY ("motoristaId") REFERENCES "motoristas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION; EXCEPTION WHEN duplicate_object THEN null; END $$;`);
        await queryRunner.query(`DO $$ BEGIN ALTER TABLE "agendamentos" ADD CONSTRAINT "FK_43835adca06d655557a47de9049" FOREIGN KEY ("veiculoId") REFERENCES "veiculos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION; EXCEPTION WHEN duplicate_object THEN null; END $$;`);
        await queryRunner.query(`DO $$ BEGIN ALTER TABLE "docas" ADD CONSTRAINT "FK_f5085a127253088e92e0ec2ad35" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE CASCADE ON UPDATE NO ACTION; EXCEPTION WHEN duplicate_object THEN null; END $$;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "docas" DROP CONSTRAINT "FK_f5085a127253088e92e0ec2ad35"`);
        await queryRunner.query(`ALTER TABLE "agendamentos" DROP CONSTRAINT "FK_43835adca06d655557a47de9049"`);
        await queryRunner.query(`ALTER TABLE "agendamentos" DROP CONSTRAINT "FK_6798a4de47db57e2a8412afcbd2"`);
        await queryRunner.query(`ALTER TABLE "agendamentos" DROP CONSTRAINT "FK_efc6a82d5fb5a0386d67c12c90f"`);
        await queryRunner.query(`ALTER TABLE "agendamentos" DROP CONSTRAINT "FK_7569f393688e7966bfdb3266340"`);
        await queryRunner.query(`ALTER TABLE "historico_status_agendamento" DROP CONSTRAINT "FK_0096fa0fde637449808c00ceee5"`);
        await queryRunner.query(`ALTER TABLE "veiculos" DROP CONSTRAINT "FK_9147d72ce6b1e27aa2625d6b48a"`);
        await queryRunner.query(`ALTER TABLE "horarios_operacao" DROP CONSTRAINT "FK_60925e51b44791eab4939c3d6b0"`);
        await queryRunner.query(`ALTER TABLE "unidades" DROP CONSTRAINT "FK_f396a9a2712244d857b21ca5bdc"`);
        await queryRunner.query(`ALTER TABLE "empresas" DROP CONSTRAINT "FK_59064268f39a070c199321cb621"`);
        await queryRunner.query(`ALTER TABLE "usuarios_empresa" DROP CONSTRAINT "FK_b551bccbcdee4dad4cb236d9362"`);
        await queryRunner.query(`DROP TABLE "docas"`);
        await queryRunner.query(`DROP TABLE "agendamentos"`);
        await queryRunner.query(`DROP TYPE "public"."agendamentos_status_enum"`);
        await queryRunner.query(`DROP TABLE "historico_status_agendamento"`);
        await queryRunner.query(`DROP TYPE "public"."historico_status_agendamento_status_enum"`);
        await queryRunner.query(`DROP TABLE "motoristas"`);
        await queryRunner.query(`DROP TABLE "veiculos"`);
        await queryRunner.query(`DROP TABLE "horarios_operacao"`);
        await queryRunner.query(`DROP TABLE "unidades"`);
        await queryRunner.query(`DROP TABLE "empresas"`);
        await queryRunner.query(`DROP TABLE "usuarios_empresa"`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_empresa_papel_enum"`);
        await queryRunner.query(`DROP TABLE "planos"`);
    }

}
