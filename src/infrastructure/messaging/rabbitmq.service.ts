import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Optional,
} from '@nestjs/common';
import * as amqp from 'amqplib';
import { envConfig } from '../../config/env.config';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.ChannelModel;
  private channel: amqp.Channel;

  constructor(
    @Optional() @Inject('RABBITMQ_URL') private readonly rabbitUrl?: string,
  ) {}

  async onModuleInit(): Promise<void> {
    const url = this.rabbitUrl || envConfig.rabbitmq.url;
    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();
  }

  async onModuleDestroy(): Promise<void> {
    try {
      if (this.channel) await this.channel.close();
    } catch {
      // Channel already closed
    }
    try {
      if (this.connection) await this.connection.close();
    } catch {
      // Connection already closed
    }
  }

  async publish(queue: string, message: any): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  }

  async consume(
    queue: string,
    callback: (message: any) => Promise<void>,
  ): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true });
    void this.channel.consume(queue, (msg: amqp.ConsumeMessage | null) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString()) as unknown;
        void callback(content).then(() => {
          this.channel.ack(msg);
        });
      }
    });
  }
}
