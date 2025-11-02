import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InventoryUpdatedEvent } from '../../common/events';
import { RabbitMQService } from '../../infrastructure/messaging/rabbitmq.service';
import { QUEUES } from '../../infrastructure/messaging/queue.constants';

@Injectable()
export class InventoryUpdatedObserver {
  constructor(private readonly rabbitMQ: RabbitMQService) {}

  @OnEvent('inventory.updated')
  async handle(event: InventoryUpdatedEvent): Promise<void> {
    await this.rabbitMQ.publish(QUEUES.NOTIFICATION, {
      type: 'INVENTORY_UPDATED',
      ...event,
    });
  }
}
