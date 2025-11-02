import { Test, TestingModule } from '@nestjs/testing';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import { RabbitMQService } from './rabbitmq.service';

describe('RabbitMQService Integration', () => {
  jest.setTimeout(60000);

  let container: StartedTestContainer;
  let service: RabbitMQService;
  let rabbitUrl: string;

  beforeAll(async () => {
    container = await new GenericContainer('rabbitmq:3-management')
      .withExposedPorts(5672)
      .withWaitStrategy(Wait.forLogMessage('Server startup complete'))
      .start();

    const port = container.getMappedPort(5672);
    rabbitUrl = `amqp://guest:guest@localhost:${port}`;
  });

  afterAll(async () => {
    if (service) {
      await service.onModuleDestroy();
    }
    if (container) {
      await container.stop();
    }
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitMQService,
        {
          provide: 'RABBITMQ_URL',
          useValue: rabbitUrl,
        },
      ],
    }).compile();

    service = module.get<RabbitMQService>(RabbitMQService);
    await service.onModuleInit();
  });

  afterEach(async () => {
    if (service) {
      await service.onModuleDestroy();
    }
  });

  describe('publish and consume', () => {
    it('should publish and consume message successfully', async () => {
      const queue = 'test.queue';
      const testMessage = { orderId: 'order-123', amount: 100 };
      const receivedMessages: any[] = [];

      await service.consume(queue, (message) => {
        receivedMessages.push(message);
        return Promise.resolve();
      });

      await service.publish(queue, testMessage);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      expect(receivedMessages).toHaveLength(1);
      expect(receivedMessages[0]).toEqual(testMessage);
    });

    it('should handle multiple messages in order', async () => {
      const queue = 'test.multi.queue';
      const messages = [
        { id: 1, data: 'first' },
        { id: 2, data: 'second' },
        { id: 3, data: 'third' },
      ];
      const receivedMessages: any[] = [];

      await service.consume(queue, (message) => {
        receivedMessages.push(message);
        return Promise.resolve();
      });

      for (const msg of messages) {
        await service.publish(queue, msg);
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));

      expect(receivedMessages).toHaveLength(3);
      expect(receivedMessages).toEqual(messages);
    });

    it('should handle complex object serialization', async () => {
      const queue = 'test.complex.queue';
      const complexMessage = {
        orderId: 'order-456',
        customer: {
          id: 'cust-123',
          name: 'John Doe',
        },
        items: [
          { productId: 'prod-1', quantity: 2, price: 100.5 },
          { productId: 'prod-2', quantity: 1, price: 50.25 },
        ],
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'api',
        },
      };
      const receivedMessages: any[] = [];

      await service.consume(queue, (message) => {
        receivedMessages.push(message);
        return Promise.resolve();
      });

      await service.publish(queue, complexMessage);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      expect(receivedMessages).toHaveLength(1);
      expect(receivedMessages[0]).toEqual(complexMessage);
    });
  });

  describe('connection', () => {
    it('should establish connection successfully', () => {
      expect(service).toBeDefined();
    });
  });
});
