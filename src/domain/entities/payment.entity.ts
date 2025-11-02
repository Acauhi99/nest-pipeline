import { PaymentStatus } from '../enums';
import { Money } from '../value-objects';

export class Payment {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly amount: Money,
    public status: PaymentStatus,
    public readonly createdAt: Date = new Date(),
  ) {}

  approve(): void {
    this.status = PaymentStatus.APPROVED;
  }

  decline(): void {
    this.status = PaymentStatus.DECLINED;
  }
}
