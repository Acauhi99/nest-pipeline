import grpc from 'k6/net/grpc';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

// Configuração do teste - 500 usuários simultâneos
export const options = {
  stages: [
    { duration: '1m', target: 100 }, // Ramp-up: 0 -> 100 usuários
    { duration: '2m', target: 250 }, // Carga média: 250 usuários
    { duration: '1m', target: 500 }, // Pico: 500 usuários
    { duration: '2m', target: 250 }, // Volta para carga média
    { duration: '1m', target: 0 }, // Ramp-down: 250 -> 0
  ],
  thresholds: {
    grpc_req_duration: ['p(95)<500'], // 95% das requests < 500ms
    errors: ['rate<0.1'], // Taxa de erro customizada < 10%
  },
};

const client = new grpc.Client();
client.load(['./src/infrastructure/grpc/proto'], 'order.proto');

export default function runLoadTest() {
  client.connect('localhost:50051', {
    plaintext: true,
    timeout: '10s',
  });

  const payload = {
    customerId: `customer-${__VU}-${__ITER}`,
    items: [
      { productId: 'prod-1', quantity: 2, unitPrice: 100 },
      { productId: 'prod-2', quantity: 1, unitPrice: 50 },
    ],
  };

  const response = client.invoke('order.OrderService/CreateOrder', payload);

  const success = check(response, {
    'status is OK': (r) => r && r.status === grpc.StatusOK,
    'has orderId': (r) => r && r.message && r.message.id !== '',
  });

  errorRate.add(!success);

  client.close();

  // Simular tempo de espera entre requests (think time)
  sleep(1);
}

export function handleSummary(data) {
  console.log('\n📊 RESUMO DO TESTE DE STRESS\n');
  console.log(`Total de requests: ${data.metrics.grpc_reqs.values.count}`);
  console.log(
    `Taxa de sucesso: ${(100 - data.metrics.grpc_req_failed.values.rate * 100).toFixed(2)}%`,
  );
  console.log(
    `Latência p95: ${data.metrics.grpc_req_duration.values['p(95)']}ms`,
  );
  console.log(
    `Latência p99: ${data.metrics.grpc_req_duration.values['p(99)']}ms`,
  );

  return {
    'summary.json': JSON.stringify(data),
  };
}
