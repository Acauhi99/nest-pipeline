export const envConfig = {
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.APP_PORT) || 3000,
  },
  grpc: {
    host: process.env.GRPC_HOST || '0.0.0.0',
    port: Number(process.env.GRPC_PORT) || 50051,
  },
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/nest-pipeline',
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
} as const;
