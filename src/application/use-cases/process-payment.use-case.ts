import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'node:crypto';
import { IOrderRepository } from '../../common/interfaces';
import { PaymentProcessedEvent } from '../../common/events';
import { Payment } from '../../domain/entities';
import { PaymentStatus, OrderStatus } from '../../domain/enums';

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new Error('Order not found');

    const payment = new Payment(
      randomUUID(),
      orderId,
      order.totalAmount,
      PaymentStatus.PROCESSING,
    );

    const approved = Math.random() > 0.2;
    if (approved) {
      payment.approve();
      order.updateStatus(OrderStatus.PAID);
    } else {
      payment.decline();
      order.updateStatus(OrderStatus.FAILED);
    }

    await this.orderRepository.save(order);

    this.eventEmitter.emit(
      'payment.processed',
      new PaymentProcessedEvent(
        payment.id,
        orderId,
        payment.status,
        payment.amount.amount,
      ),
    );
  }
}
