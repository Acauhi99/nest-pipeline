import { Test, TestingModule } from '@nestjs/testing';
import { NotificationConsumer } from './notification.consumer';
import { RabbitMQService } from '../../infrastructure/messaging/rabbitmq.service';

describe('NotificationConsumer', () => {
  let consumer: NotificationConsumer;
  let rabbitMQService: jest.Mocked<RabbitMQService>;

  beforeEach(async () => {
    const mockRabbitMQService = {
      consume: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationConsumer,
        { provide: RabbitMQService, useValue: mockRabbitMQService },
      ],
    }).compile();

    consumer = module.get<NotificationConsumer>(NotificationConsumer);
    rabbitMQService = module.get(RabbitMQService);
  });

  it('should be defined', () => {
    expect(consumer).toBeDefined();
  });

  it('should register consumer on module init', async () => {
    await consumer.onModuleInit();

    expect(rabbitMQService.consume).toHaveBeenCalledWith(
      'notification.send',
      expect.any(Function),
    );
  });

  it('should log notification when message received', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await consumer.onModuleInit();

    const callback = rabbitMQService.consume.mock.calls[0][1];
    await callback({ type: 'ORDER_CREATED' });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Sending notification:',
      'ORDER_CREATED',
    );
    consoleSpy.mockRestore();
  });
});
