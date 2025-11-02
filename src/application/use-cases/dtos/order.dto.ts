export class OrderDto {
  id: string;
  customerId: string;
  status: string;
  totalAmount: number;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  createdAt: Date;
}
