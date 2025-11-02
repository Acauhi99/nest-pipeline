import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../../infrastructure/messaging/rabbitmq.service';
import { QUEUES } from '../../infrastructure/messaging/queue.constants';

@Injectable()
export class NotificationConsumer implements OnModuleInit {
  constructor(private readonly rabbitMQ: RabbitMQService) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitMQ.consume(
      QUEUES.NOTIFICATION,
      (message: { type: string }) => {
        console.log('Sending notification:', message.type);
        console.log('Data:', JSON.stringify(message, null, 2));
        return Promise.resolve();
      },
    );
  }
}
