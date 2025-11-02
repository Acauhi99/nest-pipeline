export class InventoryUpdatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly items: Array<{
      productId: string;
      quantity: number;
      reserved: boolean;
    }>,
  ) {}
}
