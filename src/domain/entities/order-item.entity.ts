import { Money } from '../value-objects';

export class OrderItem {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly unitPrice: Money,
  ) {}

  get totalPrice(): Money {
    return this.unitPrice.multiply(this.quantity);
  }
}
