import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'node:path';

const app = await NestFactory.create(AppModule);

app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.GRPC,
  options: {
    package: 'order',
    protoPath: join(import.meta.dirname, './infrastructure/grpc/proto/order.proto'),
    url: '0.0.0.0:50051',
  },
});

await app.startAllMicroservices();
await app.listen(3000);

console.log('🚀 gRPC Server running on port 50051');
console.log('🚀 HTTP Server running on port 3000');
