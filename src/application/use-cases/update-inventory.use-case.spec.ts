import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateInventoryUseCase } from './update-inventory.use-case';
import {
  IOrderRepository,
  IInventoryLogRepository,
} from '../../common/interfaces';
import { Order, OrderItem } from '../../domain/entities';
import { OrderStatus } from '../../domain/enums';
import { Money } from '../../domain/value-objects';

describe('UpdateInventoryUseCase', () => {
  let useCase: UpdateInventoryUseCase;
  let orderRepository: jest.Mocked<IOrderRepository>;
  let inventoryLogRepository: jest.Mocked<IInventoryLogRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(async () => {
    const mockOrderRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    const mockInventoryLogRepository = {
      save: jest.fn(),
      findByOrderId: jest.fn(),
    };

    const mockEventEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateInventoryUseCase,
        { provide: 'IOrderRepository', useValue: mockOrderRepository },
        {
          provide: 'IInventoryLogRepository',
          useValue: mockInventoryLogRepository,
        },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    useCase = module.get<UpdateInventoryUseCase>(UpdateInventoryUseCase);
    orderRepository = module.get('IOrderRepository');
    inventoryLogRepository = module.get('IInventoryLogRepository');
    eventEmitter = module.get(EventEmitter2);
  });

  describe('execute', () => {
    it('should throw error if order not found', async () => {
      orderRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('order-1')).rejects.toThrow(
        'Order not found',
      );
    });

    it('should update inventory and save logs', async () => {
      const items = [
        new OrderItem('product-1', 2, new Money(100)),
        new OrderItem('product-2', 1, new Money(50)),
      ];
      const order = new Order('order-1', 'customer-1', items);
      orderRepository.findById.mockResolvedValue(order);
      orderRepository.save.mockResolvedValue(order);
      inventoryLogRepository.save.mockResolvedValue(expect.any(Object));

      await useCase.execute('order-1');

      expect(orderRepository.save).toHaveBeenCalledWith(order);
      expect(inventoryLogRepository.save).toHaveBeenCalledTimes(2);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'inventory.updated',
        expect.objectContaining({
          orderId: 'order-1',
          items: expect.any(Array),
        }),
      );
    });

    it('should update order status based on inventory result', async () => {
      const items = [new OrderItem('product-1', 1, new Money(100))];
      const order = new Order('order-1', 'customer-1', items);
      orderRepository.findById.mockResolvedValue(order);
      orderRepository.save.mockResolvedValue(order);
      inventoryLogRepository.save.mockResolvedValue(expect.any(Object));

      await useCase.execute('order-1');

      expect([OrderStatus.INVENTORY_RESERVED, OrderStatus.FAILED]).toContain(
        order.status,
      );
    });
  });
});
