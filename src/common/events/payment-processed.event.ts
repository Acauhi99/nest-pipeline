export class PaymentProcessedEvent {
  constructor(
    public readonly paymentId: string,
    public readonly orderId: string,
    public readonly status: string,
    public readonly amount: number,
  ) {}
}
