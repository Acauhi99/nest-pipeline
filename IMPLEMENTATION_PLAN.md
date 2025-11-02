# 📋 Sistema de Processamento de Pedidos

**Stack**: NestJS + gRPC + RabbitMQ + MongoDB  
**Arquitetura**: Clean Architecture + Event-Driven

---

## 🎯 STRESS TEST & CI/CD

### Stress Test Local

```bash
# Subir ambiente com limites de recursos
docker-compose -f docker-compose.stress-test.yml up -d

# Rodar teste de carga
k6 run stress-test.js

# Acessar métricas
open http://localhost:3001  # Grafana (admin/admin)
open http://localhost:9090  # Prometheus

# Limpar
docker-compose -f docker-compose.stress-test.yml down -v
```

**Limites de Recursos**:
- App: 512MB RAM, 0.5 CPU (simula AWS t3.small)
- RabbitMQ: 512MB RAM, 0.5 CPU (testa backpressure)
- MongoDB: 1GB RAM, 1 CPU (cache de índices)

**Métricas Observadas**:
- Latência: p95 < 500ms
- Taxa de erro: < 5%
- Throughput: > 100 req/s
- CPU/RAM: < 80%

### CI/CD Pipeline

**Jobs**: Lint → Security → Tests → Build → Docker

**Configurar Secrets no GitHub**:
- `DOCKER_USERNAME`: Usuário Docker Hub
- `DOCKER_PASSWORD`: Token de acesso
- `CODECOV_TOKEN`: (opcional)

**Segurança Implementada**:
- ✅ Usuário não-root em containers
- ✅ Multi-stage build
- ✅ Trivy scan de vulnerabilidades
- ✅ pnpm audit
- ✅ Permissões mínimas
- ✅ Frozen lockfile

---

## 🏗️ Arquitetura

```
src/
├── domain/              # Entities, Enums, Value Objects
├── application/         # Use Cases, Observers
├── infrastructure/      # DB, gRPC, RabbitMQ
└── microservices/       # Consumers
```

**Fluxo**: gRPC → Use Case → Observer → RabbitMQ → Consumers

---

## 🚀 Quick Start

```bash
cp .env.example .env
docker-compose up -d
pnpm install
pnpm start:dev
```

---

## 📝 Convenções

- Entities: `order.entity.ts`
- Use Cases: `create-order.use-case.ts`
- Observers: `order-created.observer.ts`
- Interfaces: `IOrderRepository`
- Tests: `*.spec.ts`

**Princípios**: Clean Architecture + Event-Driven + SOLID

---

## 🔄 Adicionando Feature

1. **Domain**: Entity + Enum
2. **Application**: Use Case + Observer
3. **Infrastructure**: Schema + Repository
4. **Module**: Registrar providers

---

## 🗄️ Database

**Collections**: orders, payments, inventory_logs

---

## 📨 RabbitMQ

**Filas**: payment.process, inventory.update, notification.send

---

## 🧪 Testes

- Unit: Jest + Mocks
- Integration: MongoDB Memory Server + Testcontainers
- Coverage: 85%+

---

## 🔒 Segurança

- ✅ Usuário não-root
- ✅ Multi-stage build
- ✅ Trivy + pnpm audit
- ✅ Secrets no GitHub
- ✅ Permissões mínimas
- ⚠️ TODO: Rate limiting, HTTPS, Auth
