import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IInventoryLogRepository,
  InventoryLog,
} from '../../../common/interfaces';
import { InventoryLogDocument } from '../../database/schemas';

@Injectable()
export class MongoInventoryLogRepository implements IInventoryLogRepository {
  constructor(
    @InjectModel(InventoryLogDocument.name)
    private readonly inventoryLogModel: Model<InventoryLogDocument>,
  ) {}

  async save(log: InventoryLog): Promise<InventoryLog> {
    const doc = await this.inventoryLogModel.create(log);
    return {
      orderId: doc.orderId,
      productId: doc.productId,
      quantity: doc.quantity,
      timestamp: doc.timestamp,
    };
  }

  async findByOrderId(orderId: string): Promise<InventoryLog[]> {
    const docs = await this.inventoryLogModel.find({ orderId }).exec();
    return docs.map((doc) => ({
      orderId: doc.orderId,
      productId: doc.productId,
      quantity: doc.quantity,
      timestamp: doc.timestamp,
    }));
  }
}
