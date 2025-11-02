import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../../infrastructure/messaging/rabbitmq.service';
import { QUEUES } from '../../infrastructure/messaging/queue.constants';
import { UpdateInventoryUseCase } from '../../application/use-cases';

@Injectable()
export class InventoryConsumer implements OnModuleInit {
  constructor(
    private readonly rabbitMQ: RabbitMQService,
    private readonly updateInventoryUseCase: UpdateInventoryUseCase,
  ) {}

  async onModuleInit() {
    await this.rabbitMQ.consume(
      QUEUES.INVENTORY,
      async (message: { orderId: string }) => {
        console.log('Updating inventory for order:', message.orderId);
        await this.updateInventoryUseCase.execute(message.orderId);
      },
    );
  }
}
