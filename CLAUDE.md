# FluxoGrão — Contexto para o Claude Code

Sistema SaaS de agendamento de janelas de descarga de grãos para o agronegócio.
Desenvolvido para o **Code Race 2026 — 11ª Edição** (Antonio Meneghetti Faculdade).

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | NestJS 11, TypeORM, PostgreSQL, JWT, Socket.io, Swagger |
| Frontend | React 18, TypeScript, Vite, react-router-dom, axios, chart.js |
| Banco (dev/prod) | PostgreSQL via Docker (`docker compose up db -d`) |
| Monorepo | Branches separadas: `backend`, `frontend`, `main` |

## Estrutura de Branches

- `main` → código estável, merge de features prontas
- `backend` → desenvolvimento do NestJS (`/backend`)
- `frontend` → desenvolvimento do React (`/frontend`)

## Como rodar

```bash
# 1. Banco de dados
docker compose up db -d

# 2. Backend (porta 3000)
cd backend && npm run start:dev

# 3. Frontend (porta 5173)
cd frontend && npm run dev
```

## Entradas úteis

- API REST: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`
- Frontend: `http://localhost:5173`

## Domínios do Backend (`backend/src/`)

```
auth/          → JWT, guards, login empresa e motorista
empresa/       → dados do tenant logado
usuarios/      → equipe da empresa (gerente, operador)
planos/        → planos SaaS (público)
unidades/      → filiais físicas da empresa
docas/         → pontos de descarga + horários de operação
slots/         → grade de disponibilidade (público)
motoristas/    → cadastro e perfil do motorista
agendamentos/  → ciclo de vida: agendado→em_patio→descarregando→concluido
dashboard/     → analytics e resumo do dia
gateway/       → WebSocket Socket.io (eventos em tempo real)
```

## Domínios do Frontend (`frontend/src/`)

```
pages/public/     → Landing, Login, Register
pages/painel/     → Dashboard, Agendamentos, Guarita, Unidades, Docas, Equipe
pages/motorista/  → Agendar, MeusAgendamentos
services/         → chamadas axios por domínio
contexts/         → AuthContext, SocketContext
hooks/            → useAuth, useSocket, useAgendamentos, useDashboard
components/       → StatusBadge, LoadingSpinner, ConfirmModal, SidebarLayout
```

## Critérios de Avaliação (Code Race)

| Critério | Foco |
|---|---|
| T1 - Higiene | DRY, funções < 20 linhas, sem magic numbers, tipagem forte |
| T2 - Segurança | OWASP Top 10, .env protegido, inputs validados, routes guardadas |
| T4 - Arquitetura | Módulos por domínio, separação de responsabilidades |
| T5 - UX | Ação principal em ≤ 3 cliques, empty states, loading, mobile-first |

## Slash Commands disponíveis

| Comando | Uso |
|---|---|
| `/appsec <arquivo>` | Revisão de segurança (T2) — OWASP Top 10 |
| `/clean <arquivo>` | Revisão de qualidade (T1/T4) — Clean Code |
| `/ux <arquivo>` | Revisão de UX/UI (T5) — usabilidade |

## Regras de negócio críticas

- **Multi-tenancy**: `empresaId` SEMPRE vem do JWT, nunca do request body
- **Status de agendamento**: fluxo unidirecional `agendado → em_patio → descarregando → concluido`
- **Slots**: calculados dinamicamente (horários de operação - agendamentos existentes)
- **Score do motorista**: atualizado ao finalizar cada descarga
