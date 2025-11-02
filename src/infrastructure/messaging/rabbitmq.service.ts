import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.ChannelModel;
  private channel: amqp.Channel;

  async onModuleInit(): Promise<void> {
    this.connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://localhost',
    );
    this.channel = await this.connection.createChannel();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
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
