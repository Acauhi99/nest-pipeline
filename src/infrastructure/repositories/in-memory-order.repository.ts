import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../../common/interfaces';
import { Order } from '../../domain/entities';

@Injectable()
export class InMemoryOrderRepository implements IOrderRepository {
  private readonly orders: Map<string, Order> = new Map();

  save(order: Order): Promise<Order> {
    this.orders.set(order.id, order);
    return Promise.resolve(order);
  }

  findById(id: string): Promise<Order | null> {
    return Promise.resolve(this.orders.get(id) || null);
  }

  findAll(): Promise<Order[]> {
    return Promise.resolve(Array.from(this.orders.values()));
  }
}
