import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateOrderUseCase } from '../../application/use-cases';
import { IOrderRepository } from '../../common/interfaces';

interface CreateOrderRequest {
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
}

interface GetOrderRequest {
  orderId: string;
}

@Controller()
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  @GrpcMethod('OrderService', 'CreateOrder')
  async createOrder(data: CreateOrderRequest) {
    return await this.createOrderUseCase.execute(data);
  }

  @GrpcMethod('OrderService', 'GetOrder')
  async getOrder(data: GetOrderRequest) {
    const order = await this.orderRepository.findById(data.orderId);
    if (!order) throw new Error('Order not found');

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
    };
  }
}
