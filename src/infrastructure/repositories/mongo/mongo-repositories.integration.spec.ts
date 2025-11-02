import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  MongoOrderRepository,
  MongoPaymentRepository,
  MongoInventoryLogRepository,
} from './';
import {
  OrderDocument,
  OrderSchema,
  PaymentDocument,
  PaymentSchema,
  InventoryLogDocument,
  InventoryLogSchema,
} from '../../database/schemas';
import { Order, OrderItem, Payment } from '../../../domain/entities';
import { OrderStatus, PaymentStatus } from '../../../domain/enums';
import { Money } from '../../../domain/value-objects';

describe('MongoDB Repositories Integration', () => {
  jest.setTimeout(30000);
  let mongod: MongoMemoryServer;
  let module: TestingModule;
  let orderRepository: MongoOrderRepository;
  let paymentRepository: MongoPaymentRepository;
  let inventoryLogRepository: MongoInventoryLogRepository;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: OrderDocument.name, schema: OrderSchema },
          { name: PaymentDocument.name, schema: PaymentSchema },
          { name: InventoryLogDocument.name, schema: InventoryLogSchema },
        ]),
      ],
      providers: [
        MongoOrderRepository,
        MongoPaymentRepository,
        MongoInventoryLogRepository,
      ],
    }).compile();

    orderRepository = module.get<MongoOrderRepository>(MongoOrderRepository);
    paymentRepository = module.get<MongoPaymentRepository>(
      MongoPaymentRepository,
    );
    inventoryLogRepository = module.get<MongoInventoryLogRepository>(
      MongoInventoryLogRepository,
    );
  });

  afterAll(async () => {
    await module.close();
    await mongod.stop();
  });

  describe('MongoOrderRepository', () => {
    it('should save and find order by id', async () => {
      const items = [new OrderItem('product-1', 2, new Money(100))];
      const order = new Order('order-1', 'customer-1', items);

      await orderRepository.save(order);
      const found = await orderRepository.findById('order-1');

      expect(found).not.toBeNull();
      expect(found?.id).toBe('order-1');
      expect(found?.customerId).toBe('customer-1');
      expect(found?.items).toHaveLength(1);
      expect(found?.totalAmount.amount).toBe(200);
    });

    it('should return null for non-existent order', async () => {
      const found = await orderRepository.findById('non-existent');
      expect(found).toBeNull();
    });

    it('should update existing order', async () => {
      const items = [new OrderItem('product-1', 1, new Money(50))];
      const order = new Order('order-2', 'customer-2', items);

      await orderRepository.save(order);
      order.updateStatus(OrderStatus.PAID);
      await orderRepository.save(order);

      const found = await orderRepository.findById('order-2');
      expect(found?.status).toBe(OrderStatus.PAID);
    });

    it('should find all orders', async () => {
      const items = [new OrderItem('product-1', 1, new Money(100))];
      const order1 = new Order('order-3', 'customer-3', items);
      const order2 = new Order('order-4', 'customer-4', items);

      await orderRepository.save(order1);
      await orderRepository.save(order2);

      const all = await orderRepository.findAll();
      expect(all.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('MongoPaymentRepository', () => {
    it('should save and find payment by order id', async () => {
      const payment = new Payment(
        'payment-1',
        'order-100',
        new Money(100),
        PaymentStatus.APPROVED,
      );

      await paymentRepository.save(payment);
      const found = await paymentRepository.findByOrderId('order-100');

      expect(found).not.toBeNull();
      expect(found?.id).toBe('payment-1');
      expect(found?.orderId).toBe('order-100');
      expect(found?.amount.amount).toBe(100);
      expect(found?.status).toBe(PaymentStatus.APPROVED);
    });

    it('should return null for non-existent payment', async () => {
      const found = await paymentRepository.findByOrderId('non-existent');
      expect(found).toBeNull();
    });
  });

  describe('MongoInventoryLogRepository', () => {
    it('should save and find inventory logs by order id', async () => {
      const log1 = {
        orderId: 'order-200',
        productId: 'product-1',
        quantity: 2,
        timestamp: new Date(),
      };
      const log2 = {
        orderId: 'order-200',
        productId: 'product-2',
        quantity: 1,
        timestamp: new Date(),
      };

      await inventoryLogRepository.save(log1);
      await inventoryLogRepository.save(log2);

      const logs = await inventoryLogRepository.findByOrderId('order-200');
      expect(logs).toHaveLength(2);
      expect(logs[0].orderId).toBe('order-200');
      expect(logs[1].orderId).toBe('order-200');
    });

    it('should return empty array for non-existent order', async () => {
      const logs = await inventoryLogRepository.findByOrderId('non-existent');
      expect(logs).toEqual([]);
    });
  });
});
