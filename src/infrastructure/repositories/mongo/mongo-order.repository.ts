import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOrderRepository } from '../../../common/interfaces';
import { Order, OrderItem } from '../../../domain/entities';
import { Money } from '../../../domain/value-objects';
import { OrderDocument } from '../../database/schemas';

@Injectable()
export class MongoOrderRepository implements IOrderRepository {
  constructor(
    @InjectModel(OrderDocument.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async save(order: Order): Promise<Order> {
    const doc = {
      id: order.id,
      customerId: order.customerId,
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice.amount,
      })),
      status: order.status,
      createdAt: order.createdAt,
    };

    await this.orderModel.findOneAndUpdate({ id: order.id }, doc, {
      upsert: true,
      new: true,
    });

    return order;
  }

  async findById(id: string): Promise<Order | null> {
    const doc = await this.orderModel.findOne({ id }).exec();
    if (!doc) return null;

    const items = doc.items.map(
      (item) =>
        new OrderItem(
          String(item.productId),
          item.quantity,
          new Money(item.unitPrice),
        ),
    );

    return new Order(
      String(doc.id),
      doc.customerId,
      items,
      doc.status,
      doc.createdAt,
    );
  }

  async findAll(): Promise<Order[]> {
    const docs = await this.orderModel.find().exec();

    return docs.map((doc) => {
      const items = doc.items.map(
        (item) =>
          new OrderItem(
            String(item.productId),
            item.quantity,
            new Money(item.unitPrice),
          ),
      );
      return new Order(
        String(doc.id),
        doc.customerId,
        items,
        doc.status,
        doc.createdAt,
      );
    });
  }
}
