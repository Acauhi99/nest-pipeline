import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OrderStatus } from '../../../domain/enums';

@Schema({ _id: false })
export class OrderItemDocument {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;
}

@Schema({ timestamps: true })
export class OrderDocument extends Document {
  @Prop({ required: true, unique: true })
  declare id: string;

  @Prop({ required: true, index: true })
  customerId: string;

  @Prop({ type: [OrderItemDocument], required: true })
  items: OrderItemDocument[];

  @Prop({ required: true, enum: OrderStatus, index: true })
  status: OrderStatus;

  @Prop({ required: true })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(OrderDocument);
