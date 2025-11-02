import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class InventoryLogDocument extends Document {
  @Prop({ required: true, index: true })
  orderId: string;

  @Prop({ required: true, index: true })
  productId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  timestamp: Date;
}

export const InventoryLogSchema =
  SchemaFactory.createForClass(InventoryLogDocument);
