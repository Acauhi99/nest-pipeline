// SCRIPT DE STRESS TEST COM K6
// Razão: Simular carga real de usuários criando pedidos

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métricas customizadas
const errorRate = new Rate('errors');

// Configuração do teste
export const options = {
  stages: [
    { duration: '30s', target: 50 }, // Ramp-up: 0 -> 50 usuários
    { duration: '1m', target: 100 }, // Carga média: 100 usuários
    { duration: '30s', target: 200 }, // Pico: 200 usuários
    { duration: '1m', target: 100 }, // Volta para carga média
    { duration: '30s', target: 0 }, // Ramp-down: 100 -> 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% das requests < 500ms
    http_req_failed: ['rate<0.05'], // Taxa de erro < 5%
    errors: ['rate<0.1'], // Taxa de erro customizada < 10%
  },
};

const BASE_URL = 'http://localhost:3000';

export default function runLoadTest() {
  // Payload do pedido
  const payload = JSON.stringify({
    customerId: `customer-${__VU}-${__ITER}`,
    items: [
      { productId: 'prod-1', quantity: 2, price: 100 },
      { productId: 'prod-2', quantity: 1, price: 50 },
    ],
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/orders`, payload, params);
  const success = check(res, {
    'status is 201': (r) => r.status === 201,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'has orderId': (r) => JSON.parse(r.body).orderId !== undefined,
  });

  errorRate.add(!success);

  // Simular tempo de espera entre requests (think time)
  sleep(1);
}

// Função executada no final do teste
export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data),
  };
}
