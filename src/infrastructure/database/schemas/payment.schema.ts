import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PaymentStatus } from '../../../domain/enums';

@Schema({ timestamps: true })
export class PaymentDocument extends Document {
  @Prop({ required: true, unique: true })
  declare id: string;

  @Prop({ required: true, index: true })
  orderId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: PaymentStatus, index: true })
  status: PaymentStatus;

  @Prop({ required: true })
  processedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentDocument);
