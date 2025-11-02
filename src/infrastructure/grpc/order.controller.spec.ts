import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { CreateOrderUseCase } from '../../application/use-cases';
import { Order, OrderItem } from '../../domain/entities';
import { OrderStatus } from '../../domain/enums';
import { Money } from '../../domain/value-objects';

describe('OrderController', () => {
  let controller: OrderController;
  let createOrderUseCase: jest.Mocked<CreateOrderUseCase>;

  beforeEach(async () => {
    const mockCreateOrderUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: CreateOrderUseCase, useValue: mockCreateOrderUseCase },
        {
          provide: 'IOrderRepository',
          useValue: { findById: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    createOrderUseCase = module.get(CreateOrderUseCase);
  });

  describe('createOrder', () => {
    it('should create order and return dto', async () => {
      const request: any = {
        customerId: 'customer-1',
        items: [{ productId: 'product-1', quantity: 2, unitPrice: 100 }],
      };

      const items = [new OrderItem('product-1', 2, new Money(100))];
      const order = new Order('order-1', 'customer-1', items);

      createOrderUseCase.execute.mockResolvedValue(order as any);

      const result = await controller.createOrder(request);

      expect(result.id).toBe('order-1');
      expect(result.customerId).toBe('customer-1');
      expect(result.status).toBe(OrderStatus.PENDING);
      expect(createOrderUseCase.execute).toHaveBeenCalledWith(request);
    });
  });

  describe('getOrder', () => {
    it('should return order by id', async () => {
      const items = [new OrderItem('product-1', 2, new Money(100))];
      const order = new Order('order-1', 'customer-1', items);

      const mockRepository = controller['orderRepository'] as any;
      mockRepository.findById.mockResolvedValue(order);

      const result = await controller.getOrder({ orderId: 'order-1' });

      expect(result.id).toBe('order-1');
      expect(result.customerId).toBe('customer-1');
      expect(result.totalAmount).toBe(200);
      expect(result.items).toHaveLength(1);
    });

    it('should throw error if order not found', async () => {
      const mockRepository = controller['orderRepository'] as any;
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        controller.getOrder({ orderId: 'non-existent' }),
      ).rejects.toThrow('Order not found');
    });
  });
});
