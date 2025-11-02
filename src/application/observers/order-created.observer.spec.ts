import { Test, TestingModule } from '@nestjs/testing';
import { OrderCreatedObserver } from './order-created.observer';
import { RabbitMQService } from '../../infrastructure/messaging/rabbitmq.service';
import { OrderCreatedEvent } from '../../common/events';
import { QUEUES } from '../../infrastructure/messaging/queue.constants';

describe('OrderCreatedObserver', () => {
  let observer: OrderCreatedObserver;
  let rabbitMQService: jest.Mocked<RabbitMQService>;

  beforeEach(async () => {
    const mockRabbitMQService = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderCreatedObserver,
        { provide: RabbitMQService, useValue: mockRabbitMQService },
      ],
    }).compile();

    observer = module.get<OrderCreatedObserver>(OrderCreatedObserver);
    rabbitMQService = module.get(RabbitMQService);
  });

  it('should publish to payment queue', async () => {
    const event = new OrderCreatedEvent('order-1', 'customer-1', 100, [
      { productId: 'product-1', quantity: 2 },
    ]);

    await observer.handle(event);

    expect(rabbitMQService.publish).toHaveBeenCalledWith(
      QUEUES.PAYMENT,
      expect.objectContaining({ orderId: 'order-1' }),
    );
  });
});
