import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrderDocument,
  OrderSchema,
  PaymentDocument,
  PaymentSchema,
  InventoryLogDocument,
  InventoryLogSchema,
} from './schemas';
import {
  MongoOrderRepository,
  MongoPaymentRepository,
  MongoInventoryLogRepository,
} from '../repositories/mongo';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/nest-pipeline',
    ),
    MongooseModule.forFeature([
      { name: OrderDocument.name, schema: OrderSchema },
      { name: PaymentDocument.name, schema: PaymentSchema },
      { name: InventoryLogDocument.name, schema: InventoryLogSchema },
    ]),
  ],
  providers: [
    MongoOrderRepository,
    MongoPaymentRepository,
    MongoInventoryLogRepository,
  ],
  exports: [
    MongoOrderRepository,
    MongoPaymentRepository,
    MongoInventoryLogRepository,
  ],
})
export class MongoModule {}
