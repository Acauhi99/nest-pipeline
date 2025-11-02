import { OrderItem } from './order-item.entity';
import { Money } from '../value-objects';

describe('OrderItem', () => {
  describe('totalPrice', () => {
    it('should calculate total price', () => {
      const item = new OrderItem('product-1', 3, new Money(100));
      expect(item.totalPrice.amount).toBe(300);
    });

    it('should handle quantity of 1', () => {
      const item = new OrderItem('product-1', 1, new Money(50));
      expect(item.totalPrice.amount).toBe(50);
    });

    it('should handle quantity of 0', () => {
      const item = new OrderItem('product-1', 0, new Money(100));
      expect(item.totalPrice.amount).toBe(0);
    });
  });
});
