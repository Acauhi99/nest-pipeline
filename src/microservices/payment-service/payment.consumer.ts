import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../../infrastructure/messaging/rabbitmq.service';
import { QUEUES } from '../../infrastructure/messaging/queue.constants';
import { ProcessPaymentUseCase } from '../../application/use-cases';

@Injectable()
export class PaymentConsumer implements OnModuleInit {
  constructor(
    private readonly rabbitMQ: RabbitMQService,
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
  ) {}

  async onModuleInit() {
    await this.rabbitMQ.consume(
      QUEUES.PAYMENT,
      async (message: { orderId: string }) => {
        console.log('Processing payment for order:', message.orderId);
        await this.processPaymentUseCase.execute(message.orderId);
      },
    );
  }
}
