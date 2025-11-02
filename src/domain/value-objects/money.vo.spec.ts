import { Money } from './money.vo';

describe('Money', () => {
  describe('constructor', () => {
    it('should create money with valid amount', () => {
      const money = new Money(100);
      expect(money.amount).toBe(100);
    });

    it('should throw error for negative amount', () => {
      expect(() => new Money(-10)).toThrow('Amount cannot be negative');
    });
  });

  describe('add', () => {
    it('should add two money values', () => {
      const money1 = new Money(100);
      const money2 = new Money(50);
      const result = money1.add(money2);
      expect(result.amount).toBe(150);
    });

    it('should return new instance', () => {
      const money1 = new Money(100);
      const money2 = new Money(50);
      const result = money1.add(money2);
      expect(result).not.toBe(money1);
      expect(result).not.toBe(money2);
    });
  });
});
