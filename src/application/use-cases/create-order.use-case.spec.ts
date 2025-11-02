import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateOrderUseCase } from './create-order.use-case';
import { IOrderRepository } from '../../common/interfaces';
import { OrderStatus } from '../../domain/enums';

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let orderRepository: jest.Mocked<IOrderRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(async () => {
    const mockOrderRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    const mockEventEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderUseCase,
        { provide: 'IOrderRepository', useValue: mockOrderRepository },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    useCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);
    orderRepository = module.get('IOrderRepository');
    eventEmitter = module.get(EventEmitter2);
  });

  describe('execute', () => {
    it('should create order and emit event', async () => {
      const dto = {
        customerId: 'customer-1',
        items: [
          { productId: 'product-1', quantity: 2, unitPrice: 100 },
          { productId: 'product-2', quantity: 1, unitPrice: 50 },
        ],
      };

      orderRepository.save.mockResolvedValue(expect.any(Object));

      const result = await useCase.execute(dto);

      expect(result.customerId).toBe('customer-1');
      expect(result.items).toHaveLength(2);
      expect(result.status).toBe(OrderStatus.PENDING);
      expect(orderRepository.save).toHaveBeenCalledTimes(1);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'order.created',
        expect.objectContaining({
          orderId: expect.any(String),
          customerId: 'customer-1',
        }),
      );
    });

    it('should generate unique order id', async () => {
      const dto = {
        customerId: 'customer-1',
        items: [{ productId: 'product-1', quantity: 1, unitPrice: 100 }],
      };

      orderRepository.save.mockResolvedValue(expect.any(Object));

      const result1 = await useCase.execute(dto);
      const result2 = await useCase.execute(dto);

      expect(result1.id).not.toBe(result2.id);
    });
  });
});
