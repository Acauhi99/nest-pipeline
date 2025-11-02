import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProcessPaymentUseCase } from './process-payment.use-case';
import { IOrderRepository, IPaymentRepository } from '../../common/interfaces';
import { Order, OrderItem } from '../../domain/entities';
import { OrderStatus } from '../../domain/enums';
import { Money } from '../../domain/value-objects';

describe('ProcessPaymentUseCase', () => {
  let useCase: ProcessPaymentUseCase;
  let orderRepository: jest.Mocked<IOrderRepository>;
  let paymentRepository: jest.Mocked<IPaymentRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(async () => {
    const mockOrderRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    const mockPaymentRepository = {
      save: jest.fn(),
      findByOrderId: jest.fn(),
    };

    const mockEventEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessPaymentUseCase,
        { provide: 'IOrderRepository', useValue: mockOrderRepository },
        { provide: 'IPaymentRepository', useValue: mockPaymentRepository },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    useCase = module.get<ProcessPaymentUseCase>(ProcessPaymentUseCase);
    orderRepository = module.get('IOrderRepository');
    paymentRepository = module.get('IPaymentRepository');
    eventEmitter = module.get(EventEmitter2);
  });

  describe('execute', () => {
    it('should throw error if order not found', async () => {
      orderRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('order-1')).rejects.toThrow(
        'Order not found',
      );
    });

    it('should process payment and update order', async () => {
      const items = [new OrderItem('product-1', 2, new Money(100))];
      const order = new Order('order-1', 'customer-1', items);
      orderRepository.findById.mockResolvedValue(order);
      orderRepository.save.mockResolvedValue(order);
      paymentRepository.save.mockResolvedValue(expect.any(Object));

      await useCase.execute('order-1');

      expect(orderRepository.save).toHaveBeenCalledWith(order);
      expect(paymentRepository.save).toHaveBeenCalledTimes(1);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'payment.processed',
        expect.objectContaining({
          orderId: 'order-1',
          status: expect.any(String),
        }),
      );
    });

    it('should update order status based on payment result', async () => {
      const items = [new OrderItem('product-1', 1, new Money(100))];
      const order = new Order('order-1', 'customer-1', items);
      orderRepository.findById.mockResolvedValue(order);
      orderRepository.save.mockResolvedValue(order);
      paymentRepository.save.mockResolvedValue(expect.any(Object));

      await useCase.execute('order-1');

      expect([OrderStatus.PAID, OrderStatus.FAILED]).toContain(order.status);
    });
  });
});
