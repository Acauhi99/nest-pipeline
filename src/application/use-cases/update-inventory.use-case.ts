import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IOrderRepository } from '../../common/interfaces';
import { InventoryUpdatedEvent } from '../../common/events';
import { OrderStatus } from '../../domain/enums';

@Injectable()
export class UpdateInventoryUseCase {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new Error('Order not found');

    const reserved = Math.random() > 0.1;
    if (reserved) {
      order.updateStatus(OrderStatus.INVENTORY_RESERVED);
    } else {
      order.updateStatus(OrderStatus.FAILED);
    }

    await this.orderRepository.save(order);

    this.eventEmitter.emit(
      'inventory.updated',
      new InventoryUpdatedEvent(
        orderId,
        order.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          reserved,
        })),
      ),
    );
  }
}
