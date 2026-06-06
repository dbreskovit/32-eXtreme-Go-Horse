<div align="center">

# 🌾 FluxoGrão

### Agendamento Inteligente de Fluxo Graneleiro

*"A solução é programação, não tem saída. Não dá para enviar o caminhão se não tem onde armazenar."*

[![Status do Projeto](https://img.shields.io/badge/🚧_Status-Em_Desenvolvimento-f59e0b?style=for-the-badge)](https://github.com/)
[![Code Race 2026](https://img.shields.io/badge/🏁_Code_Race-2026-6366f1?style=for-the-badge)](https://github.com/)
[![Licença](https://img.shields.io/badge/⚖️_Licença-MIT-10b981?style=for-the-badge)](https://github.com/)

[![React](https://img.shields.io/badge/React_18-20232a?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

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
- [Pitch](#-pitch)

---

## 🚀 Visão Geral

**FluxoGrão** é uma plataforma inovadora que conecta motoristas, cooperativas e operadores logísticos num sistema unificado de agendamento de janelas de descarga. 

> Desenvolvido para a **Code Race 2026 — 11ª Edição** (Antonio Meneghetti Faculdade).

Diga adeus às filas de horas ou dias em frente aos silos. Substituímos o caos por inteligência logística, reduzindo o custo do frete, economizando diesel e acelerando toda a cadeia produtiva do agronegócio.

---

## 👥 A Equipe

**Nome da Equipe:** FluxoGrão

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
| Itaqui/RS: forte em agro, sofre com gargalos logísticos | [Jornal do Comércio, mai/2026](https://www.jornaldocomercio.com/mapa-economico/regiao-sul/2026/05/1247798-forte-no-agronegocio-municipio-itaqui-sofre-com-dificuldades-logisticas.html) |
| Rodovias ruins geraram 1,2 bi de litros de diesel extras em 2025 | [Frete não acompanha custo, transportadoras operam no limite — AF News, 2026](https://afnews.com.br/frete-nao-acompanha-custo-e-transportadoras-operam-no-limite-em-2026/) |
| "A solução é programação" — Sopesp sobre congestionamento no T-Grão | [Caminhões congestionam terminal de grãos em Santos — Agrimidia](https://agrimidia.com.br/economia/2013/03/06/caminhoes-congestionam-terminal-de-graos-em-santos/) |
| Porto de Paranaguá elimina filas com agendamento por janela horária | [Porto de Paranaguá tem novo sistema de agendamentos — Portos do Paraná](https://www.portosdoparana.pr.gov.br/Noticia/Porto-de-Paranagua-tem-novo-sistema-de-agendamentos-para-descarga-de-caminhoes) |
| T-Grão Santos: 98% de assertividade nos agendamentos | [T-Grão — Terminal de Granéis em Santos](https://tgrao.com.br/) |
| Logística de grãos: tecnologia como chave para destravar o escoamento | [Portal do Agronegócio, abr/2026](https://www.portaldoagronegocio.com.br/gestao-rural/logistica-e-transporte/noticias/logistica-de-graos-no-brasil-enfrenta-gargalos-historicos-e-tecnologia-surge-como-chave-para-destravar-o-escoamento) |
| Agronegócio em cenário desfavorável às vésperas do Plano Safra 2026/27 | [Repórter Ceará, abr/2026](https://reporterceara.com.br/2026/04/11/agronegocio-encara-cenario-desfavoravel-as-vesperas-do-novo-plano-safra-2026-2027/) |
| Recorde de recuperações judiciais no agro em 2025 (+50%) | [CNN Brasil — Fernanda Pressinott, mar/2026](https://www.cnnbrasil.com.br/blogs/fernanda-pressinott/agro/um-recorde-ruim-para-o-agronegocio/) |

---

## 💡 A Solução

**FluxoGrão** traz a tecnologia dos grandes portos diretamente para as cooperativas:

1. **Gestão de Docas**: A cooperativa cadastra suas docas e a capacidade de recebimento por slot.
2. **Distribuição Inteligente**: Nosso algoritmo balanceia o fluxo ao longo das 24h, sugerindo janelas alternativas para evitar picos.
3. **Visão 360º**: O operador acompanha, em tempo real, o volume de chegadas e recebe alertas preditivos de congestionamento.
4. **Analytics Sustentável**: Relatórios detalhados calculam impacto ambiental (CO₂ não emitido) e economia financeira.

### 💰 Modelo de Negócio

| Plano | Público-Alvo | Preço Mensal |
|---|---|:---:|
| **Gratuito** | 1 unidade (adoção inicial) | R$ 0,00 |
| **Regional** | Até 5 unidades | R$ 690,00 |
| **Enterprise**| Tradings e portos (API + SLA) | Sob consulta |

---

## ✨ Features e Status

> **Marco I — Registro do Projeto**
> Repositório registrado, escopo definido e stack escolhida.

| Feature | Status |
|---|:---:|
| 🏢 **Cadastro de unidade receptora** | ⏳ Não iniciado |
| ⚙️ **Configuração de capacidade por doca** | ⏳ Não iniciado |
| 📅 **Listagem de slots disponíveis** | ⏳ Não iniciado |
| 📱 **Agendamento pelo motorista** | ⏳ Não iniciado |
| 📡 **Painel do operador em tempo real** | ⏳ Não iniciado |
| 🚨 **Alerta de slot no limite** | ⏳ Não iniciado |
| 📊 **Gráfico de fluxo por hora** | ⏳ Não iniciado |
| 📍 **Próximas chegadas com status** | ⏳ Não iniciado |
| 🧠 **Algoritmo de sugestão de slot** | ⏳ Não iniciado |
| ⭐ **Score de pontualidade do motorista** | ⏳ Não iniciado |
| 🗺️ **Grade de ocupação por doca** | ⏳ Não iniciado |
| 📈 **Relatório semanal de eficiência** | ⏳ Não iniciado |
| 🌱 **Calculadora Sustentável** | ⏳ Não iniciado |

---

## 🛠️ Stack Técnica

| Categoria | Tecnologia |
|---|---|
| **Linguagens** | JavaScript (ES2022+), TypeScript |
| **Frontend** | React 18, Vite |
| **Backend** | Node.js, Express |
| **Banco de Dados** | SQLite (dev) ➔ PostgreSQL (prod) |
| **Tempo Real** | Socket.io |
| **Mapas & Gráficos** | Leaflet.js, OpenStreetMap, Chart.js |
| **Ferramentas** | qrcode.js, date-fns, axios, cors, dotenv |
| **Deploy** | Docker (Backend + DB), Vercel (Frontend) |

---

## 🏗️ Arquitetura

> *TODO: Será preenchido entre a 8ª e a 10ª hora (Marco III) com a arquitetura detalhada do sistema.*

---

## ⚙️ Guia de Instalação

> *TODO: Será preenchido entre a 8ª e a 10ª hora (Marco III) com as instruções exatas de setup e execução.*

---

## 🎬 Pitch

> *TODO: O link será inserido após gravação do vídeo (até o Marco II `[ENTREGA-8H]`).*

🎥 **Link do Pitch (até 3 minutos):** *A preencher*

---

<div align="center">

**FluxoGrão** — *Organizando o fluxo, acelerando o agro.*

Feito para a **Code Race 2026** — 11ª Edição · Antonio Meneghetti Faculdade · 05–06 jun 2026.

</div>
