import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPaymentRepository } from '../../../common/interfaces';
import { Payment } from '../../../domain/entities';
import { Money } from '../../../domain/value-objects';
import { PaymentDocument } from '../../database/schemas';

@Injectable()
export class MongoPaymentRepository implements IPaymentRepository {
  constructor(
    @InjectModel(PaymentDocument.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  async save(payment: Payment): Promise<Payment> {
    const doc = {
      id: payment.id,
      orderId: payment.orderId,
      amount: payment.amount.amount,
      status: payment.status,
      processedAt: payment.createdAt,
    };

    await this.paymentModel.findOneAndUpdate({ id: payment.id }, doc, {
      upsert: true,
      new: true,
    });

    return payment;
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const doc = await this.paymentModel.findOne({ orderId }).exec();
    if (!doc) return null;

    return new Payment(
      String(doc.id),
      doc.orderId,
      new Money(doc.amount),
      doc.status,
      doc.processedAt,
    );
  }
}
