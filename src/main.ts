import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'node:path';
import { envConfig } from './config/env.config';

const app = await NestFactory.create(AppModule);

app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.GRPC,
  options: {
    package: 'order',
    protoPath: join(
      import.meta.dirname,
      './infrastructure/grpc/proto/order.proto',
    ),
    url: `${envConfig.grpc.host}:${envConfig.grpc.port}`,
  },
});

await app.startAllMicroservices();
await app.listen(envConfig.app.port);

console.log(
  `🚀 gRPC Server running on ${envConfig.grpc.host}:${envConfig.grpc.port}`,
);
console.log(`🚀 HTTP Server running on port ${envConfig.app.port}`);
