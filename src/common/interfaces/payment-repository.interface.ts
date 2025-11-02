import { Payment } from '../../domain/entities';

export interface IPaymentRepository {
  save(payment: Payment): Promise<Payment>;
  findByOrderId(orderId: string): Promise<Payment | null>;
}
