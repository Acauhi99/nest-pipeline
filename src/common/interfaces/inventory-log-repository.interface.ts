export interface InventoryLog {
  orderId: string;
  productId: string;
  quantity: number;
  timestamp: Date;
}

export interface IInventoryLogRepository {
  save(log: InventoryLog): Promise<InventoryLog>;
  findByOrderId(orderId: string): Promise<InventoryLog[]>;
}
