-- FluxoGrão - Inicialização do banco de dados
-- Executado automaticamente na primeira criação do container

-- Extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- busca textual aproximada
