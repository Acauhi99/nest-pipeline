import { Test, TestingModule } from '@nestjs/testing';
import { PaymentConsumer } from './payment.consumer';
import { ProcessPaymentUseCase } from '../../application/use-cases';
import { RabbitMQService } from '../../infrastructure/messaging/rabbitmq.service';

describe('PaymentConsumer', () => {
  let consumer: PaymentConsumer;
  let processPaymentUseCase: jest.Mocked<ProcessPaymentUseCase>;
  let rabbitMQService: jest.Mocked<RabbitMQService>;

  beforeEach(async () => {
    const mockProcessPaymentUseCase = {
      execute: jest.fn(),
    };

    const mockRabbitMQService = {
      consume: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentConsumer,
        {
          provide: ProcessPaymentUseCase,
          useValue: mockProcessPaymentUseCase,
        },
        { provide: RabbitMQService, useValue: mockRabbitMQService },
      ],
    }).compile();

    consumer = module.get<PaymentConsumer>(PaymentConsumer);
    processPaymentUseCase = module.get(ProcessPaymentUseCase);
    rabbitMQService = module.get(RabbitMQService);
  });

  it('should be defined', () => {
    expect(consumer).toBeDefined();
  });

  it('should register consumer on module init', async () => {
    await consumer.onModuleInit();

    expect(rabbitMQService.consume).toHaveBeenCalledWith(
      'payment.process',
      expect.any(Function),
    );
  });

  it('should process payment when message received', async () => {
    processPaymentUseCase.execute.mockResolvedValue();
    await consumer.onModuleInit();

    const callback = rabbitMQService.consume.mock.calls[0][1];
    await callback({ orderId: 'order-1' });

    expect(processPaymentUseCase.execute).toHaveBeenCalledWith('order-1');
  });
});
