# 📋 Plano de Implementação - Sistema de Processamento de Pedidos

**Projeto**: NestJS + gRPC + RabbitMQ
**Arquitetura**: Use Case Pattern + Event-Driven + Clean Architecture
**Data Início**: 2025
**Status**: 🟡 Em Progresso

---

## 🎯 Objetivo

Sistema distribuído de processamento de pedidos com:

- API Gateway via gRPC
- Comunicação assíncrona via RabbitMQ
- Arquitetura orientada a eventos com Observers
- Microserviços: Payment, Inventory, Notification

---

## 📁 Estrutura de Pastas

```
src/
├── common/
│   ├── events/
│   └── interfaces/
├── domain/
│   ├── entities/
│   ├── enums/
│   └── value-objects/
├── application/
│   ├── use-cases/
│   └── observers/
├── infrastructure/
│   ├── repositories/
│   ├── messaging/
│   └── grpc/
└── microservices/
    ├── payment-service/
    ├── inventory-service/
    └── notification-service/
```

---

## 🔄 Fluxo de Eventos

```
Cliente (gRPC) → CreateOrderUseCase → Order Entity → Repository
                                    ↓
                            OrderCreatedObserver
                                    ↓
                              RabbitMQ Publish
                    ↓               ↓               ↓
            PaymentService   InventoryService   NotificationService
```

---

## 🚀 Fases de Implementação

### ✅ Fase 1: Foundation (Setup Básico)

- [x] 1.1 - Inicializar projeto NestJS
- [x] 1.2 - Configurar TypeScript (strict mode)
- [x] 1.3 - Criar estrutura de pastas
- [x] 1.4 - Configurar dependências (gRPC, RabbitMQ, EventEmitter)

### ⬜ Fase 2: Domain Layer (Núcleo de Negócio)

- [ ] 2.1 - Criar enums (OrderStatus, PaymentStatus)
- [ ] 2.2 - Criar Value Objects (Money)
- [ ] 2.3 - Criar Entities (Order, OrderItem, Payment)
- [ ] 2.4 - Criar Domain Events

### ⬜ Fase 3: Infrastructure Layer (Ferramentas)

- [ ] 3.1 - Configurar RabbitMQ Module
- [ ] 3.2 - Criar RabbitMQ Service (publish/consume)
- [ ] 3.3 - Definir constantes de filas
- [ ] 3.4 - Criar Repository Interface
- [ ] 3.5 - Implementar InMemory Repository
- [ ] 3.6 - Criar Proto definitions (gRPC)

### ⬜ Fase 4: Application Layer (Casos de Uso)

- [ ] 4.1 - Criar DTOs (CreateOrderDto, OrderDto)
- [ ] 4.2 - Implementar CreateOrderUseCase
- [ ] 4.3 - Implementar ProcessPaymentUseCase
- [ ] 4.4 - Implementar UpdateInventoryUseCase
- [ ] 4.5 - Criar OrderCreatedObserver
- [ ] 4.6 - Criar PaymentProcessedObserver
- [ ] 4.7 - Criar InventoryUpdatedObserver

### ⬜ Fase 5: API Layer (Exposição gRPC)

- [ ] 5.1 - Criar gRPC Controller
- [ ] 5.2 - Conectar Use Cases ao Controller
- [ ] 5.3 - Configurar gRPC Server
- [ ] 5.4 - Adicionar validações

### ⬜ Fase 6: Microservices (Workers)

- [ ] 6.1 - Implementar Payment Service Consumer
- [ ] 6.2 - Implementar Inventory Service Consumer
- [ ] 6.3 - Implementar Notification Service Consumer
- [ ] 6.4 - Configurar Dead Letter Queues

### ⬜ Fase 7: Tests & DevOps

- [ ] 7.1 - Unit tests (Use Cases)
- [ ] 7.2 - Unit tests (Observers)
- [ ] 7.3 - Integration tests (gRPC)
- [ ] 7.4 - Docker Compose (RabbitMQ + App)
- [ ] 7.5 - README com instruções

---

## 📦 Dependências Principais

```json
{
  "@nestjs/core": "^10.x",
  "@nestjs/microservices": "^10.x",
  "@nestjs/event-emitter": "^2.x",
  "@grpc/grpc-js": "^1.x",
  "@grpc/proto-loader": "^0.7.x",
  "amqplib": "^0.10.x",
  "class-validator": "^0.14.x",
  "class-transformer": "^0.5.x"
}
```

---

## 🎯 Princípios Arquiteturais

1. **Separation of Concerns**: Cada camada tem responsabilidade única
2. **Dependency Inversion**: Domain não depende de Infrastructure
3. **Single Responsibility**: Um Use Case = Uma operação
4. **Event-Driven**: Comunicação desacoplada via eventos
5. **Testability**: Tudo mockável e testável isoladamente

---

## 📝 Convenções de Código

- **Entities**: `order.entity.ts`
- **Use Cases**: `create-order.use-case.ts`
- **Observers**: `order-created.observer.ts`
- **DTOs**: `create-order.dto.ts`
- **Interfaces**: `I` prefix (ex: `IOrderRepository`)
- **Tests**: `.spec.ts` para unit, `.e2e-spec.ts` para E2E

---

## 🔄 Log de Progresso

### 2025-01-XX

- ✅ Plano de implementação criado
- ✅ Fase 1 concluída: Setup básico
  - Projeto inicializado com pnpm
  - TypeScript configurado (strict mode)
  - Estrutura de pastas criada
  - Dependências instaladas: NestJS, gRPC, RabbitMQ, EventEmitter
  - Scripts configurados (build, start, test)
  - Pacotes atualizados para versões mais recentes:
    - NestJS 10.x → 11.x
    - EventEmitter 2.x → 3.x
    - @types/node 20.x → 24.x
  - Build testado e funcionando ✅
- ⏳ Próximo: Fase 2 - Domain Layer

---

## 📌 Notas Importantes

- Começar com in-memory repository (sem banco de dados)
- RabbitMQ rodando local ou Docker
- gRPC na porta 50051
- Foco em legibilidade e testabilidade
- Minimal code, máxima clareza

---

**Última Atualização**: 2025-01-XX
**Próximo Step**: Fase 2.1 - Criar enums (OrderStatus, PaymentStatus)
