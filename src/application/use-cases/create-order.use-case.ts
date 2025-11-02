import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'node:crypto';
import { IOrderRepository } from '../../common/interfaces';
import { OrderCreatedEvent } from '../../common/events';
import { Order, OrderItem } from '../../domain/entities';
import { Money } from '../../domain/value-objects';
import { CreateOrderDto, OrderDto } from './dtos';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: CreateOrderDto): Promise<OrderDto> {
    const items = dto.items.map(
      (item) =>
        new OrderItem(item.productId, item.quantity, new Money(item.unitPrice)),
    );

    const order = new Order(randomUUID(), dto.customerId, items);
    await this.orderRepository.save(order);

    this.eventEmitter.emit(
      'order.created',
      new OrderCreatedEvent(
        order.id,
        order.customerId,
        order.totalAmount.amount,
        items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      ),
    );

    return {
      id: order.id,
      customerId: order.customerId,
      status: order.status,
      totalAmount: order.totalAmount.amount,
      items: order.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice.amount,
      })),
      createdAt: order.createdAt,
    };
  }
}
