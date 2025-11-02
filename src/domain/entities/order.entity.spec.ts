import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../enums';
import { Money } from '../value-objects';

describe('Order', () => {
  const createTestOrder = () => {
    const items = [
      new OrderItem('product-1', 2, new Money(100)),
      new OrderItem('product-2', 1, new Money(50)),
    ];
    return new Order('order-1', 'customer-1', items);
  };

  describe('totalAmount', () => {
    it('should calculate total amount from items', () => {
      const order = createTestOrder();
      expect(order.totalAmount.amount).toBe(250);
    });

    it('should return zero for empty items', () => {
      const order = new Order('order-1', 'customer-1', []);
      expect(order.totalAmount.amount).toBe(0);
    });
  });

  describe('updateStatus', () => {
    it('should update order status', () => {
      const order = createTestOrder();
      expect(order.status).toBe(OrderStatus.PENDING);
      order.updateStatus(OrderStatus.PAID);
      expect(order.status).toBe(OrderStatus.PAID);
    });
  });

  describe('constructor', () => {
    it('should create order with default status PENDING', () => {
      const order = createTestOrder();
      expect(order.status).toBe(OrderStatus.PENDING);
    });

    it('should create order with custom status', () => {
      const items = [new OrderItem('product-1', 1, new Money(100))];
      const order = new Order('order-1', 'customer-1', items, OrderStatus.PAID);
      expect(order.status).toBe(OrderStatus.PAID);
    });
  });
});
