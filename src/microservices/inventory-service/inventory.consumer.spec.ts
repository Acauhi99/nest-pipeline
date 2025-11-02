import { Test, TestingModule } from '@nestjs/testing';
import { InventoryConsumer } from './inventory.consumer';
import { UpdateInventoryUseCase } from '../../application/use-cases';
import { RabbitMQService } from '../../infrastructure/messaging/rabbitmq.service';

describe('InventoryConsumer', () => {
  let consumer: InventoryConsumer;
  let updateInventoryUseCase: jest.Mocked<UpdateInventoryUseCase>;
  let rabbitMQService: jest.Mocked<RabbitMQService>;

  beforeEach(async () => {
    const mockUpdateInventoryUseCase = {
      execute: jest.fn(),
    };

    const mockRabbitMQService = {
      consume: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryConsumer,
        {
          provide: UpdateInventoryUseCase,
          useValue: mockUpdateInventoryUseCase,
        },
        { provide: RabbitMQService, useValue: mockRabbitMQService },
      ],
    }).compile();

    consumer = module.get<InventoryConsumer>(InventoryConsumer);
    updateInventoryUseCase = module.get(UpdateInventoryUseCase);
    rabbitMQService = module.get(RabbitMQService);
  });

  it('should be defined', () => {
    expect(consumer).toBeDefined();
  });

  it('should register consumer on module init', async () => {
    await consumer.onModuleInit();

    expect(rabbitMQService.consume).toHaveBeenCalledWith(
      'inventory.update',
      expect.any(Function),
    );
  });

  it('should update inventory when message received', async () => {
    updateInventoryUseCase.execute.mockResolvedValue();
    await consumer.onModuleInit();

    const callback = rabbitMQService.consume.mock.calls[0][1];
    await callback({ orderId: 'order-1' });

    expect(updateInventoryUseCase.execute).toHaveBeenCalledWith('order-1');
  });
});
