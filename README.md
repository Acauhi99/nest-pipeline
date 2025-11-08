# NestJS Pipeline

Sistema de processamento de pedidos construído para praticar Docker e CI/CD. Implementa uma arquitetura de microserviços com comunicação assíncrona via filas.

## O que faz

Processa pedidos através de um pipeline assíncrono:

1. Cliente cria pedido via gRPC
2. Sistema publica eventos no RabbitMQ
3. Microserviços consomem as filas e processam:
   - Payment Service: processa pagamento
   - Inventory Service: atualiza estoque
   - Notification Service: envia notificações

Cada etapa persiste dados no MongoDB e emite novos eventos para o próximo estágio.

## Como funciona

**Arquitetura**: Clean Architecture com separação em camadas (Domain, Application, Infrastructure)

**Comunicação**:
- Síncrona: gRPC para criação/consulta de pedidos
- Assíncrona: RabbitMQ para processamento em background

**Fluxo de dados**:
```
Cliente → gRPC → CreateOrder → Event → RabbitMQ → [Payment, Inventory, Notification]
```

## Stack

- **Runtime**: Node.js 20 + TypeScript
- **Framework**: NestJS
- **Comunicação**: gRPC, RabbitMQ (AMQP)
- **Database**: MongoDB
- **Testes**: Jest, Testcontainers, MongoDB Memory Server
- **Containerização**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Segurança**: Trivy (vulnerability scanning)

## Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Subir infraestrutura (MongoDB + RabbitMQ)
docker compose up -d

# Rodar aplicação
pnpm start:dev

# Executar testes
pnpm test
pnpm test:cov

# Build
pnpm build
```

## Docker

**Multi-stage build** para otimizar tamanho da imagem:
- Stage 1: Build da aplicação
- Stage 2: Imagem final apenas com runtime e dist/

**Boas práticas implementadas**:
- Usuário não-root (node:node)
- .dockerignore para reduzir contexto
- Cache de dependências do pnpm
- Imagem base Alpine (menor footprint)

```bash
# Build local
docker build -t nest-pipeline .

# Rodar container
docker run -p 3000:3000 -p 50051:50051 nest-pipeline
```

## CI/CD Pipeline

Pipeline automatizada no GitHub Actions com 5 jobs:

### 1. Lint & Format
- ESLint para qualidade de código
- Prettier para formatação consistente

### 2. Security Scan
- `pnpm audit` para vulnerabilidades em dependências
- Trivy para scan de código e configurações
- Upload de resultados para GitHub Security

### 3. Tests
- Testes unitários e de integração
- Cobertura mínima de 80%
- Serviços (MongoDB, RabbitMQ) via GitHub Actions services

### 4. Build
- Compilação TypeScript
- Upload de artefatos (dist/)

### 5. Docker Build
- Build da imagem Docker
- Scan de vulnerabilidades com Trivy
- Executa apenas em push para main

**Triggers**: Push e Pull Request nas branches main/develop

**Segurança**:
- Permissões mínimas (least privilege)
- Dependências fixadas com frozen-lockfile
- Scan de vulnerabilidades em múltiplas etapas

## Testes

**Cobertura atual**: ~99% statements, 85% branches

**Tipos de teste**:
- Unit: Entidades, Value Objects, Use Cases
- Integration: Repositories (MongoDB), Messaging (RabbitMQ)
- Mocks: EventEmitter, Repositories

**Ferramentas**:
- Jest como test runner
- Testcontainers para testes de integração com containers reais
- MongoDB Memory Server para testes rápidos

## Estrutura do Projeto

```
src/
├── domain/              # Entidades, Value Objects, Enums
├── application/         # Use Cases, DTOs, Observers
├── infrastructure/      # gRPC, RabbitMQ, MongoDB, Repositories
├── microservices/       # Consumers (Payment, Inventory, Notification)
└── config/              # Configurações de ambiente
```

## Licença

MIT
