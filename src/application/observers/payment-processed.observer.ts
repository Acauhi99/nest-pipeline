import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentProcessedEvent } from '../../common/events';
import { RabbitMQService } from '../../infrastructure/messaging/rabbitmq.service';
import { QUEUES } from '../../infrastructure/messaging/queue.constants';

@Injectable()
export class PaymentProcessedObserver {
  constructor(private readonly rabbitMQ: RabbitMQService) {}

  @OnEvent('payment.processed')
  async handle(event: PaymentProcessedEvent): Promise<void> {
    await this.rabbitMQ.publish(QUEUES.NOTIFICATION, {
      type: 'PAYMENT_PROCESSED',
      ...event,
    });
  }
}
