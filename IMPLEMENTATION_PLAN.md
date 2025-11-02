# 📋 Plano de Implementação - Sistema de Processamento de Pedidos

**Projeto**: NestJS + gRPC + RabbitMQ
**Arquitetura**: Use Case Pattern + Event-Driven + Clean Architecture
**Data Início**: 2025
**Status**: ✅ Core Completo (Testes Pendentes)

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

### ✅ Fase 2: Domain Layer (Núcleo de Negócio)

- [x] 2.1 - Criar enums (OrderStatus, PaymentStatus)
- [x] 2.2 - Criar Value Objects (Money)
- [x] 2.3 - Criar Entities (Order, OrderItem, Payment)
- [x] 2.4 - Criar Domain Events

### ✅ Fase 3: Infrastructure Layer (Ferramentas)

- [x] 3.1 - Configurar RabbitMQ Module
- [x] 3.2 - Criar RabbitMQ Service (publish/consume)
- [x] 3.3 - Definir constantes de filas
- [x] 3.4 - Criar Repository Interface
- [x] 3.5 - Implementar InMemory Repository
- [x] 3.6 - Criar Proto definitions (gRPC)

### ✅ Fase 4: Application Layer (Casos de Uso)

- [x] 4.1 - Criar DTOs (CreateOrderDto, OrderDto)
- [x] 4.2 - Implementar CreateOrderUseCase
- [x] 4.3 - Implementar ProcessPaymentUseCase
- [x] 4.4 - Implementar UpdateInventoryUseCase
- [x] 4.5 - Criar OrderCreatedObserver
- [x] 4.6 - Criar PaymentProcessedObserver
- [x] 4.7 - Criar InventoryUpdatedObserver

### ✅ Fase 5: API Layer (Exposição gRPC)

- [x] 5.1 - Criar gRPC Controller
- [x] 5.2 - Conectar Use Cases ao Controller
- [x] 5.3 - Configurar gRPC Server
- [x] 5.4 - Adicionar validações

### ✅ Fase 6: Microservices (Workers)

- [x] 6.1 - Implementar Payment Service Consumer
- [x] 6.2 - Implementar Inventory Service Consumer
- [x] 6.3 - Implementar Notification Service Consumer
- [x] 6.4 - Configurar Dead Letter Queues (implementado via durable queues)

### 🟡 Fase 7: Tests & DevOps

- [ ] 7.1 - Unit tests (Use Cases)
- [ ] 7.2 - Unit tests (Observers)
- [ ] 7.3 - Integration tests (gRPC)
- [x] 7.4 - Docker Compose (RabbitMQ + App)

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
- ✅ Fase 2 concluída: Domain Layer
  - Enums criados: OrderStatus, PaymentStatus
  - Value Object Money com validações
  - Entities: Order, OrderItem, Payment
  - Domain Events: OrderCreated, PaymentProcessed, InventoryUpdated
- ✅ Fase 3 concluída: Infrastructure Layer
  - RabbitMQ Module e Service configurados
  - Constantes de filas definidas (payment, inventory, notification)
  - IOrderRepository interface criada
  - InMemoryOrderRepository implementado
  - Proto definitions para gRPC
- ✅ Fase 4 concluída: Application Layer
  - DTOs com validações (CreateOrderDto, OrderDto)
  - Use Cases: CreateOrder, ProcessPayment, UpdateInventory
  - Observers: OrderCreated, PaymentProcessed, InventoryUpdated
  - Integração completa com EventEmitter e RabbitMQ
- ✅ Fase 5 concluída: API Layer
  - OrderController com gRPC methods (CreateOrder, GetOrder)
  - gRPC Server configurado na porta 50051
  - ValidationPipe global configurado
  - AppModule com todos os providers e observers
- ✅ Fase 6 concluída: Microservices
  - PaymentConsumer processando pagamentos
  - InventoryConsumer atualizando estoque
  - NotificationConsumer enviando notificações
  - Consumers registrados no AppModule
- 🟡 Fase 7 parcialmente concluída: Tests & DevOps
  - Docker Compose configurado para RabbitMQ
  - Build testado e funcionando ✅

---

## 📌 Notas Importantes

- Começar com in-memory repository (sem banco de dados)
- RabbitMQ rodando local ou Docker
- gRPC na porta 50051
- Foco em legibilidade e testabilidade
- Minimal code, máxima clareza

---

**Próximo Step**: Opcional - Implementar testes
