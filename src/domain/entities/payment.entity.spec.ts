import { Payment } from './payment.entity';
import { PaymentStatus } from '../enums';
import { Money } from '../value-objects';

describe('Payment', () => {
  const createTestPayment = () => {
    return new Payment(
      'payment-1',
      'order-1',
      new Money(100),
      PaymentStatus.PROCESSING,
    );
  };

  describe('approve', () => {
    it('should change status to APPROVED', () => {
      const payment = createTestPayment();
      payment.approve();
      expect(payment.status).toBe(PaymentStatus.APPROVED);
    });
  });

  describe('decline', () => {
    it('should change status to DECLINED', () => {
      const payment = createTestPayment();
      payment.decline();
      expect(payment.status).toBe(PaymentStatus.DECLINED);
    });
  });

  describe('constructor', () => {
    it('should create payment with default status PROCESSING', () => {
      const payment = new Payment(
        'payment-1',
        'order-1',
        new Money(100),
        PaymentStatus.PROCESSING,
      );
      expect(payment.status).toBe(PaymentStatus.PROCESSING);
    });
  });
});
