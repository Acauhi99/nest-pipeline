import { Test, TestingModule } from '@nestjs/testing';
import { InventoryUpdatedObserver } from './inventory-updated.observer';
import { RabbitMQService } from '../../infrastructure/messaging/rabbitmq.service';
import { InventoryUpdatedEvent } from '../../common/events';
import { QUEUES } from '../../infrastructure/messaging/queue.constants';

describe('InventoryUpdatedObserver', () => {
  let observer: InventoryUpdatedObserver;
  let rabbitMQService: jest.Mocked<RabbitMQService>;

  beforeEach(async () => {
    const mockRabbitMQService = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryUpdatedObserver,
        { provide: RabbitMQService, useValue: mockRabbitMQService },
      ],
    }).compile();

    observer = module.get<InventoryUpdatedObserver>(InventoryUpdatedObserver);
    rabbitMQService = module.get(RabbitMQService);
  });

  it('should publish to notification queue', async () => {
    const event = new InventoryUpdatedEvent('order-1', [
      { productId: 'product-1', quantity: 2, reserved: true },
    ]);

    await observer.handle(event);

    expect(rabbitMQService.publish).toHaveBeenCalledWith(
      QUEUES.NOTIFICATION,
      expect.objectContaining({ orderId: 'order-1' }),
    );
  });
});
