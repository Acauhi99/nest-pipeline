# 🚀 NestJS Pipeline - Sistema de Processamento de Pedidos

Sistema de microserviços com NestJS, gRPC, RabbitMQ e MongoDB seguindo Clean Architecture.

## 📦 Stack

- **Backend**: NestJS + TypeScript
- **Comunicação**: gRPC + RabbitMQ
- **Database**: MongoDB
- **Testes**: Jest + Testcontainers
- **CI/CD**: GitHub Actions
- **Monitoramento**: Prometheus + Grafana

## 🏃 Quick Start

```bash
# Instalar dependências
pnpm install

# Subir infraestrutura
docker compose up -d

# Desenvolvimento
pnpm start:dev

# Testes
pnpm test
pnpm test:cov

# Build
pnpm build
```

## 🧪 Stress Test

```bash
# Subir ambiente com limites de recursos
docker compose -f docker-compose.stress-test.yml up -d

# Executar teste de carga
k6 run stress-test.js

# Acessar métricas
open http://localhost:3001  # Grafana (admin/admin)
open http://localhost:9090  # Prometheus
```

## 📚 Documentação

Veja [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) para:

- Arquitetura detalhada
- Guia de desenvolvimento
- Configuração de CI/CD
- Passo a passo de stress test
- Boas práticas de segurança

## 🔒 Segurança

- ✅ Usuário não-root em containers
- ✅ Multi-stage Docker build
- ✅ Scan de vulnerabilidades (Trivy)
- ✅ Secrets management no CI/CD
- ✅ Audit de dependências

## 📊 CI/CD

Pipeline automatizado com:

- Lint & Format check
- Security scanning
- Unit & Integration tests
- Coverage tracking (80% mínimo)
- Docker build & push

## 📄 Licença

ISC
