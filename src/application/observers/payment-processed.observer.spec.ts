import { Test, TestingModule } from '@nestjs/testing';
import { PaymentProcessedObserver } from './payment-processed.observer';
import { RabbitMQService } from '../../infrastructure/messaging/rabbitmq.service';
import { PaymentProcessedEvent } from '../../common/events';
import { PaymentStatus } from '../../domain/enums';
import { QUEUES } from '../../infrastructure/messaging/queue.constants';

describe('PaymentProcessedObserver', () => {
  let observer: PaymentProcessedObserver;
  let rabbitMQService: jest.Mocked<RabbitMQService>;

  beforeEach(async () => {
    const mockRabbitMQService = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentProcessedObserver,
        { provide: RabbitMQService, useValue: mockRabbitMQService },
      ],
    }).compile();

    observer = module.get<PaymentProcessedObserver>(PaymentProcessedObserver);
    rabbitMQService = module.get(RabbitMQService);
  });

  it('should publish to notification queue', async () => {
    const event = new PaymentProcessedEvent(
      'payment-1',
      'order-1',
      PaymentStatus.APPROVED,
      100,
    );

    await observer.handle(event);

    expect(rabbitMQService.publish).toHaveBeenCalledWith(
      QUEUES.NOTIFICATION,
      expect.objectContaining({ orderId: 'order-1' }),
    );
  });
});
