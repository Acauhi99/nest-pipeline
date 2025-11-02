import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../../common/events';
import { RabbitMQService } from '../../infrastructure/messaging/rabbitmq.service';
import { QUEUES } from '../../infrastructure/messaging/queue.constants';

@Injectable()
export class OrderCreatedObserver {
  constructor(private readonly rabbitMQ: RabbitMQService) {}

  @OnEvent('order.created')
  async handle(event: OrderCreatedEvent): Promise<void> {
    await this.rabbitMQ.publish(QUEUES.PAYMENT, event);
    await this.rabbitMQ.publish(QUEUES.INVENTORY, event);
    await this.rabbitMQ.publish(QUEUES.NOTIFICATION, {
      type: 'ORDER_CREATED',
      ...event,
    });
  }
}
