export class OrderCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly totalAmount: number,
    public readonly items: Array<{
      productId: string;
      quantity: number;
    }>,
  ) {}
}
