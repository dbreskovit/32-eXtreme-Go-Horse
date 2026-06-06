<div align="center">

# 🌾 FluxoGrão

### Agendamento Inteligente de Fluxo Graneleiro

*"A solução é programação, não tem saída. Não dá para enviar o caminhão se não tem onde armazenar."*

[![Status do Projeto](https://img.shields.io/badge/🚀_Status-MVP_Concluído-22c55e?style=for-the-badge)](https://github.com/)
[![Code Race 2026](https://img.shields.io/badge/🏁_Code_Race-2026-6366f1?style=for-the-badge)](https://github.com/)
[![Licença](https://img.shields.io/badge/⚖️_Licença-MIT-10b981?style=for-the-badge)](https://github.com/)

[![React](https://img.shields.io/badge/React_18-20232a?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS_11-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-316192?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

> [!IMPORTANT]
> **O frontend está rodando com dados mockados (persistidos em `localStorage`).**
> Houve um problema na integração com o backend, então, para garantir a demonstração do pitch, o front opera de forma autônoma — sem depender da API.
>
> **Backend e frontend rodam de forma totalmente independente:** o backend (NestJS + PostgreSQL) sobe e funciona normalmente por conta própria, e o frontend funciona por conta própria em modo mock. Para reconectar o front à API real, basta definir `VITE_MOCK=false` no `frontend/.env`.
>
> Detalhes da camada de mock em [`frontend/src/mocks/`](frontend/src/mocks/) (`config.ts`, `db.ts`, `adapter.ts`).

---

## 📑 Índice

- [Visão Geral](#-visão-geral)
- [A Equipe](#-a-equipe)
- [O Problema](#-o-problema)
- [A Solução](#-a-solução)
- [Features e Status](#-features-e-status)
- [Stack Técnica](#-stack-técnica)
- [Arquitetura](#-arquitetura)
- [Guia de Instalação](#-guia-de-instalação)
- [Deploy](#-deploy)
- [Pitch](#-pitch)

---

## 🚀 Visão Geral

**FluxoGrão** é uma plataforma SaaS que conecta motoristas, cooperativas e operadores logísticos num sistema unificado de agendamento de janelas de descarga de grãos.

> Desenvolvido para a **Code Race 2026 — 11ª Edição** (Antonio Meneghetti Faculdade).

Diga adeus às filas de horas ou dias em frente aos silos. Substituímos o caos por inteligência logística, reduzindo o custo do frete, economizando diesel e acelerando toda a cadeia produtiva do agronegócio.

---

## 👥 A Equipe

**Nome da Equipe:** 32 eXtreme Go Horse

| Integrante | Função |
|---|---|
| **Arthur Willers** | Programador |
| **Diego Breskovit** | Programador |
| **Gabriel Dill** | Programador |
| **Gustavo Pich** | Programador |
| **Leonardo Bandeira** | Programador |

---

## 🚨 O Problema

O Brasil colheu **356 milhões de toneladas de grãos** na safra 2025/26, mas nossa capacidade estática de armazenagem atende apenas a 223 milhões.

O resultado? O escoamento é forçado no pico da safra, concentrando milhares de caminhões simultaneamente.
- Frete rodoviário sobe **20% a 30%** (por falta de organização, não de caminhões).
- Diesel é desperdiçado em filas intermináveis.
- Produtores vendem com pressão de baixa devido à demora no escoamento.

*A solução testada nos grandes portos, como o agendamento por janela horária (Paranaguá) e represamento em pátio (T-Grão Santos, com 98% de assertividade), **ainda não havia chegado aos silos e cooperativas do interior.** Até agora.*

### 📚 Fontes e Embasamento

| Dado | Fonte |
|---|---|
| Safra 2025/26 estimada em 356 M t e déficit de armazenagem | [Escoamento da safra e os desafios da logística no agronegócio — Buonny, mai/2026](https://buonny.com.br/blog/escoamento-da-safra/) |
| Frete sobe 20–30% no pico; tecnologia reduz gargalos em até 40% | [Safra acima de 330 M t: gargalos elevam custo e comprimem margens — MomentoMT, mai/2026](https://momentomt.com.br/momento-agro/com-safra-acima-de-330-milhoes-de-toneladas-gargalos-elevam-custo-e-comprimem-margens/) |
| 100% dos problemas da soja são logística interna e externa | [Notícias Agrícolas — Pátria Agronegócios, mar/2026](https://www.noticiasagricolas.com.br/videos/bom-dia-agronegocio/417459-100-dos-problemas-do-mercado-brasileiro-de-soja-hoje-sao-as-logisticas-externa-e-interna-afirma-patria.html) |
| Rodovias ruins geraram 1,2 bi de litros de diesel extras em 2025 | [Frete não acompanha custo, transportadoras operam no limite — AF News, 2026](https://afnews.com.br/frete-nao-acompanha-custo-e-transportadoras-operam-no-limite-em-2026/) |
| "A solução é programação" — Sopesp sobre congestionamento no T-Grão | [Caminhões congestionam terminal de grãos em Santos — Agrimidia](https://agrimidia.com.br/economia/2013/03/06/caminhoes-congestionam-terminal-de-graos-em-santos/) |
| Porto de Paranaguá elimina filas com agendamento por janela horária | [Porto de Paranaguá tem novo sistema de agendamentos — Portos do Paraná](https://www.portosdoparana.pr.gov.br/Noticia/Porto-de-Paranagua-tem-novo-sistema-de-agendamentos-para-descarga-de-caminhoes) |
| T-Grão Santos: 98% de assertividade nos agendamentos | [T-Grão — Terminal de Granéis em Santos](https://tgrao.com.br/) |

---

## 💡 A Solução

**FluxoGrão** traz a tecnologia dos grandes portos diretamente para as cooperativas:

1. **Gestão de Docas**: A cooperativa cadastra suas docas e a capacidade de recebimento por slot.
2. **Agendamento pelo Motorista**: Escolhe unidade, doca, data e horário em menos de 1 minuto pelo celular.
3. **Guarita Digital**: Operador busca por código QR ou placa — o sistema avança o status automaticamente.
4. **Visão 360º**: Painel ao vivo com fluxo por hora, próximas chegadas e alertas preditivos.
5. **Analytics Sustentável**: Calcula CO₂ não emitido e horas de fila eliminadas em tempo real.

### 💰 Modelo de Negócio

| Plano | Público-Alvo | Preço Mensal |
|---|---|:---:|
| **Gratuito** | 1 unidade (adoção inicial) | R$ 0,00 |
| **Regional** | Até 5 unidades | R$ 690,00 |
| **Enterprise** | Tradings e portos (API + SLA) | Sob consulta |

---

## ✨ Features e Status

### Frontend

| Feature | Status |
|---|:---:|
| 🏠 **Landing page** com hero, stats, como funciona e planos | ✅ Concluído |
| 🔐 **Login** — dual tab Empresa / Motorista | ✅ Concluído |
| 📝 **Cadastro** — 2 etapas (dados + plano) com AnimatePresence | ✅ Concluído |
| 📊 **Dashboard** — KPIs, gráfico de fluxo por hora, próximas chegadas | ✅ Concluído |
| 📅 **Agendamentos** — tabela com filtros por status e máquina de estado | ✅ Concluído |
| 🚦 **Guarita** — busca por código QR ou placa, lista em pátio | ✅ Concluído |
| 🏢 **Unidades e Docas** — accordion com detalhes por unidade | ✅ Concluído |
| 📱 **Portal Motorista — Agendar** — fluxo 4 etapas (unidade → doca → horário → confirmar) | ✅ Concluído |
| 📋 **Portal Motorista — Meus Agendamentos** — cards com código, status e cancelamento | ✅ Concluído |
| 🎨 **Design System** — Verde & Ouro, Instrument Serif, Plus Jakarta Sans, motion/react | ✅ Concluído |
| 🌿 **Calculadora Sustentável** — CO₂ não emitido e horas de fila eliminadas | ✅ Concluído |
| ⭐ **Score de pontualidade** — exibição no perfil do motorista | ✅ Concluído |

### Backend

| Feature | Status |
|---|:---:|
| 🔐 **Auth JWT** — login empresa e motorista, guards, refresh | ✅ Concluído |
| 🏢 **Módulo Empresa** — CRUD multi-tenant | ✅ Concluído |
| 👤 **Módulo Usuários** — equipe da empresa (gerente, operador) | ✅ Concluído |
| 💳 **Módulo Planos** — listagem pública dos planos SaaS | ✅ Concluído |
| 🏭 **Módulo Unidades** — filiais físicas da empresa | ✅ Concluído |
| ⚓ **Módulo Docas** — pontos de descarga + horários de operação | ✅ Concluído |
| 🕐 **Módulo Slots** — grade de disponibilidade calculada dinamicamente | ✅ Concluído |
| 🚚 **Módulo Motoristas** — cadastro e perfil com score | ✅ Concluído |
| 📆 **Módulo Agendamentos** — ciclo `agendado→em_patio→descarregando→concluido` | ✅ Concluído |
| 📈 **Módulo Dashboard** — analytics e resumo do dia | ✅ Concluído |
| ⚡ **WebSocket Gateway** — eventos em tempo real via Socket.io | ✅ Concluído |
| 📖 **Swagger** — documentação automática em `/api/docs` | ✅ Concluído |
| 🔒 **Multi-tenancy** — `empresaId` sempre via JWT, nunca via body | ✅ Concluído |
| 🗄️ **Migrations TypeORM** — versionamento do schema | ✅ Concluído |
| 🧠 **Algoritmo de sugestão de slot** | ⏳ Planejado |
| 📈 **Relatório semanal de eficiência** | ⏳ Planejado |

---

## 🛠️ Stack Técnica

| Categoria | Tecnologia |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS v4 |
| **Animações** | motion/react (AnimatePresence, page transitions) |
| **Gráficos** | recharts (AreaChart) |
| **Fontes** | Instrument Serif, Plus Jakarta Sans, JetBrains Mono |
| **Backend** | NestJS 11, TypeScript |
| **ORM** | TypeORM |
| **Banco de Dados** | PostgreSQL 16 |
| **Autenticação** | JWT + Passport.js |
| **Tempo Real** | Socket.io (WebSocket Gateway) |
| **Datas** | date-fns com locale ptBR |
| **HTTP** | axios |
| **Infra** | Docker + Docker Compose |
| **Documentação API** | Swagger / OpenAPI |

---

## 🏗️ Arquitetura

```
32-eXtreme-Go-Horse/
├── backend/                  # NestJS 11 — API REST + WebSocket
│   └── src/
│       ├── auth/             # JWT guards, estratégias, login
│       ├── empresa/          # Tenant principal (multi-tenancy)
│       ├── usuarios/         # Equipe da empresa
│       ├── planos/           # Planos SaaS (rota pública)
│       ├── unidades/         # Filiais físicas
│       ├── docas/            # Pontos de descarga
│       ├── slots/            # Grade de disponibilidade
│       ├── motoristas/       # Cadastro e score do motorista
│       ├── agendamentos/     # Máquina de estado do agendamento
│       ├── dashboard/        # Analytics do dia
│       └── gateway/          # Socket.io — eventos em tempo real
│
├── frontend/                 # React 18 + Vite + TypeScript
│   └── src/
│       ├── pages/
│       │   ├── public/       # Landing, Login, Cadastro
│       │   ├── painel/       # Dashboard, Agendamentos, Guarita, Unidades
│       │   └── motorista/    # Agendar, MeusAgendamentos
│       ├── components/       # SidebarLayout, StatusBadge, ProtectedRoute
│       ├── contexts/         # AuthContext, SocketContext
│       ├── hooks/            # useAuth, useAgendamentos, useDashboard
│       ├── mocks/            # Dados mockados para desenvolvimento
│       └── types/            # Tipos TypeScript compartilhados
│
├── database/
│   └── init.sql              # Extensões PostgreSQL (uuid-ossp, pg_trgm)
│
└── docker-compose.yml        # PostgreSQL 16 + Adminer (opcional)
```

### Fluxo Principal

```
Motorista (mobile) ──────► API /slots ──────► Escolha de janela
                    ──────► POST /agendamentos ──────► Código QR gerado

Guarita (tablet)   ──────► GET /agendamentos/:codigo ──────► Dados do caminhão
                    ──────► PATCH /agendamentos/:id/status ──────► Avança estado

Dashboard (desktop) ◄───── WebSocket ──────► Eventos em tempo real
                    ◄───── GET /dashboard/hoje ──────► KPIs do dia
```

---

## ⚙️ Guia de Instalação

### Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

### 1. Clonar o repositório

```bash
git clone https://github.com/dbreskovit/32-eXtreme-Go-Horse.git
cd 32-eXtreme-Go-Horse
```

### 2. Configurar variáveis de ambiente

**Backend** — crie `backend/.env`:
```env
DATABASE_URL=postgresql://fluxograo:fluxograo@localhost:5432/fluxograo
JWT_SECRET=sua-chave-secreta-aqui
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=3000
```

**Frontend** — crie `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
# Modo apresentação (dados em localStorage, sem backend). Use "false" para conectar à API real.
VITE_MOCK=true
```

### 3. Subir o banco de dados

```bash
docker compose up db -d
```

> Aguarde o health check passar (10–15 segundos). Para visualizar os dados, suba também o Adminer:
> ```bash
> docker compose --profile tools up -d
> # Acesse: http://localhost:8080
> ```

### 4. Instalar dependências e iniciar o backend

```bash
cd backend
npm install
npm run start:dev
```

API disponível em: `http://localhost:3000/api`
Swagger em: `http://localhost:3000/api/docs`

### 5. Instalar dependências e iniciar o frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em: `http://localhost:5173`

### Credenciais de teste (modo mock)

> O frontend já vem em **modo mock** por padrão (dados em `localStorage`, sem backend).
> Para usar a API real, defina `VITE_MOCK=false` em `frontend/.env`.

| Tipo | Usuário | Senha |
|---|---|---|
| Empresa | `carlos@empresaxpto.com.br` | `senha123` |
| Motorista | `(55) 99876-5432` (telefone) | `ABC-1D23` (placa) |

> No modo mock, o login de **motorista** aceita qualquer telefone + placa (cria o cadastro na hora, igual ao backend real).

---

## 🚀 Deploy

### Variáveis de ambiente para produção

**Backend** (`backend/.env.production`):
```env
DATABASE_URL=postgresql://USER:PASS@HOST:5432/fluxograo
JWT_SECRET=chave-longa-e-segura-gerada-aleatoriamente
FRONTEND_URL=https://seudominio.vercel.app
NODE_ENV=production
PORT=3000
```

**Frontend** (`frontend/.env.production`):
```env
VITE_API_URL=https://seubackend.railway.app
```

---

### Opção A — Docker Compose completo (recomendado para VPS)

Ideal para subir tudo num único servidor (DigitalOcean, Hetzner, etc.).

```bash
# Na raiz do projeto
docker compose up -d
```

O `docker-compose.yml` já inclui o banco PostgreSQL. Para o backend e o frontend em containers, adicione os serviços conforme necessário.

**Build de produção do frontend:**
```bash
cd frontend && npm run build
# A pasta dist/ pode ser servida por nginx ou Caddy
```

**Build de produção do backend:**
```bash
cd backend && npm run build
node dist/main.js
```

---

### Opção B — Railway (backend + banco) + Vercel (frontend)

Configuração recomendada para deploys rápidos durante o hackathon.

#### Backend no Railway

1. Crie um projeto em [railway.app](https://railway.app)
2. Adicione um **PostgreSQL** plugin — o `DATABASE_URL` é injetado automaticamente
3. Conecte o repositório GitHub e configure o **Root Directory** como `backend`
4. Adicione as variáveis de ambiente (`JWT_SECRET`, `FRONTEND_URL`, `NODE_ENV=production`)
5. O Railway detecta o `package.json` e executa `npm run build && node dist/main.js`

```
Root Directory: backend
Build Command:  npm run build
Start Command:  node dist/main.js
```

#### Frontend na Vercel

1. Importe o repositório em [vercel.com](https://vercel.com)
2. Configure o **Root Directory** como `frontend`
3. Adicione a variável `VITE_API_URL` apontando para a URL do Railway
4. A Vercel detecta o Vite e executa `npm run build` automaticamente

```
Root Directory: frontend
Build Command:  npm run build
Output Dir:     dist
```

---

### Opção C — Render (backend + banco)

Similar ao Railway, mas com tier gratuito mais generoso para PostgreSQL.

1. Crie um **Web Service** com Root Directory `backend`
2. Crie um **PostgreSQL** database e copie a connection string
3. Configure as env vars e defina:
   ```
   Build: npm install && npm run build
   Start: node dist/main.js
   ```

---

### Migrations em produção

Antes de iniciar o backend em produção, rode as migrations:

```bash
cd backend
npm run migration:run
```

> Em desenvolvimento, `synchronize: true` no TypeORM cria/atualiza as tabelas automaticamente.
> Em produção (`NODE_ENV=production`), `synchronize` é desabilitado — use migrations.

---

## 🎬 Pitch

🎥 **Link do Pitch (até 3 minutos):** *A preencher*

---

<div align="center">

**FluxoGrão** — *Organizando o fluxo, acelerando o agro.*

Feito para a **Code Race 2026** — 11ª Edição · Antonio Meneghetti Faculdade · 05–06 jun 2026.

</div>
