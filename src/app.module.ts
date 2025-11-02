import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RabbitMQModule } from './infrastructure/messaging/rabbitmq.module';
import { MongoModule } from './infrastructure/database/mongo.module';
import {
  MongoOrderRepository,
  MongoPaymentRepository,
  MongoInventoryLogRepository,
} from './infrastructure/repositories';

import {
  CreateOrderUseCase,
  ProcessPaymentUseCase,
  UpdateInventoryUseCase,
} from './application/use-cases';
import {
  OrderCreatedObserver,
  PaymentProcessedObserver,
  InventoryUpdatedObserver,
} from './application/observers';
import { OrderController } from './infrastructure/grpc/order.controller';
import { PaymentConsumer } from './microservices/payment-service/payment.consumer';
import { InventoryConsumer } from './microservices/inventory-service/inventory.consumer';
import { NotificationConsumer } from './microservices/notification-service/notification.consumer';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 10,
    }),
    MongoModule,
    RabbitMQModule,
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: 'IOrderRepository',
      useExisting: MongoOrderRepository,
    },
    {
      provide: 'IPaymentRepository',
      useExisting: MongoPaymentRepository,
    },
    {
      provide: 'IInventoryLogRepository',
      useExisting: MongoInventoryLogRepository,
    },
    CreateOrderUseCase,
    ProcessPaymentUseCase,
    UpdateInventoryUseCase,
    OrderCreatedObserver,
    PaymentProcessedObserver,
    InventoryUpdatedObserver,
    PaymentConsumer,
    InventoryConsumer,
    NotificationConsumer,
  ],
})
export class AppModule {}
