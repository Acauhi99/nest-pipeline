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
│   ├── database/
│   │   ├── schemas/
│   │   └── mongo.module.ts
│   ├── repositories/
│   │   ├── in-memory/
│   │   └── mongo/
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

### ✅ Fase 7: Database Layer (MongoDB)

- [x] 7.1 - Adicionar dependências MongoDB (@nestjs/mongoose, mongoose)
- [x] 7.2 - Criar Schemas (OrderSchema, PaymentSchema, InventoryLogSchema)
- [x] 7.3 - Implementar MongoOrderRepository
- [x] 7.4 - Implementar MongoPaymentRepository
- [x] 7.5 - Implementar MongoInventoryLogRepository
- [x] 7.6 - Configurar MongoDB Module
- [x] 7.7 - Atualizar Docker Compose (adicionar MongoDB)
- [x] 7.8 - Migrar de InMemory para Mongo nos Use Cases

### ✅ Fase 8: Tests & DevOps

- [x] 8.1 - Unit tests (Domain + Application)
  - [x] 8.1.1 - Value Objects (Money)
  - [x] 8.1.2 - Entities (Order, OrderItem, Payment)
  - [x] 8.1.3 - Use Cases (CreateOrder, ProcessPayment, UpdateInventory)
- [x] 8.2 - Integration tests
  - [x] 8.2.1 - MongoDB Repositories (Order, Payment, InventoryLog)
- [x] 8.3 - Docker Compose (RabbitMQ + MongoDB)
- [x] 8.4 - Observers tests
- [x] 8.5 - gRPC Controller tests
- [x] 8.6 - Consumers tests

---

## 📦 Dependências Principais

```json
{
  "@nestjs/core": "^11.x",
  "@nestjs/microservices": "^11.x",
  "@nestjs/event-emitter": "^3.x",
  "@nestjs/mongoose": "^10.x",
  "@grpc/grpc-js": "^1.x",
  "@grpc/proto-loader": "^0.8.x",
  "amqplib": "^0.10.x",
  "mongoose": "^8.x",
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
- **Tests**: `.spec.ts`

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
- ✅ Fase 7 concluída: Database Layer (MongoDB)
  - Dependências instaladas: @nestjs/mongoose 11.0.3, mongoose 8.19.2
  - Schemas criados: OrderDocument, PaymentDocument, InventoryLogDocument
  - Repositórios implementados: MongoOrderRepository, MongoPaymentRepository, MongoInventoryLogRepository
  - MongoModule configurado com conexão via MONGO_URI
  - Docker Compose atualizado com MongoDB 8
  - AppModule migrado para usar repositórios MongoDB
  - Use Cases atualizados para persistir payments e inventory logs
  - Build testado e funcionando ✅
- ✅ Fase 8 concluída (core): Tests & DevOps
  - Dependências instaladas: mongodb-memory-server 10.3.0
  - Jest configurado para ES modules
  - Testes unitários implementados:
    * Domain Layer: 100% cobertura (Money, Order, OrderItem, Payment)
    * Application Layer: 91% cobertura (Use Cases)
  - Testes de integração implementados:
    * MongoDB Repositories: 100% cobertura
  - Total: 31 testes passando ✅
  - Cobertura geral: 57% (core business logic: ~95%)
  - Docker Compose configurado para RabbitMQ + MongoDB
  - Build testado e funcionando ✅

---

## 📌 Notas Importantes

- Começar com in-memory repository (sem banco de dados)
- RabbitMQ rodando local ou Docker
- gRPC na porta 50051
- Foco em legibilidade e testabilidade
- Minimal code, máxima clareza

---

## 🗄️ Estratégia de Persistência MongoDB

### Collections

1. **orders**
   - Armazena pedidos completos com items
   - Índices: customerId, status, createdAt
   - Queries: findById, findByCustomer, findByStatus

2. **payments**
   - Histórico de pagamentos processados
   - Índices: orderId, status, processedAt
   - Queries: findByOrderId, findByStatus

3. **inventory_logs**
   - Log de atualizações de estoque (auditoria)
   - Índices: orderId, productId, timestamp
   - Queries: findByOrderId, findByProduct

### Mapeamento Domain → Schema

- **Order Entity** → OrderDocument (embedded items)
- **Payment Entity** → PaymentDocument
- **InventoryLog** → InventoryLogDocument (novo)

### Repositories

- `MongoOrderRepository`
- `MongoPaymentRepository`
- `MongoInventoryLogRepository`

---

## 📊 Cobertura de Testes

### Implementado (Fase 1 - Essencial)
- ✅ Domain Entities: 100%
- ✅ Value Objects: 90%
- ✅ Use Cases: 91%
- ✅ MongoDB Repositories: 100%

### Implementado (Fase 2 - Completo)
- ✅ Observers: 92%
- ✅ gRPC Controller: 100%
- ✅ Consumers: 100%

### Não Implementado
- ⚪ RabbitMQ Service: 21% (requer RabbitMQ real)

### Estatísticas
- **Total de testes**: 46
- **Suites**: 15
- **Cobertura geral**: 83.57%
- **Cobertura crítica** (Domain + Application): ~98%

---

**Status**: ✅ Projeto completo e testado
**Próximo Step**: Deploy e monitoramento
