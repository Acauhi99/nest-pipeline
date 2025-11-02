import { OrderStatus } from '../enums';
import { Money } from '../value-objects';
import { OrderItem } from './order-item.entity';

export class Order {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly items: OrderItem[],
    public status: OrderStatus = OrderStatus.PENDING,
    public readonly createdAt: Date = new Date(),
  ) {}

  get totalAmount(): Money {
    return this.items.reduce(
      (acc, item) => acc.add(item.totalPrice),
      new Money(0),
    );
  }

  updateStatus(status: OrderStatus): void {
    this.status = status;
  }
}
