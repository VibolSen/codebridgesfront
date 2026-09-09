export interface ServiceStatus {
  id: string;
  name: string;
  port: number;
  container: string;
  database: string;
  status: 'healthy' | 'degraded' | 'offline';
  latency: number;
  uptime: string;
  memory: string;
  cpu: string;
  connections: number;
  version: string;
}

export const INITIAL_SERVICES: ServiceStatus[] = [
  {
    id: 'gateway',
    name: 'Nginx API Gateway',
    port: 8080,
    container: 'codebridge-api-gateway',
    database: 'Reverse Proxy',
    status: 'healthy',
    latency: 2,
    uptime: '99.99% (14d 6h)',
    memory: '38 MB / 512 MB',
    cpu: '0.4%',
    connections: 142,
    version: 'nginx:alpine',
  },
  {
    id: 'auth-service',
    name: 'Auth & Identity Service',
    port: 8001,
    container: 'pos-auth-service',
    database: 'codebridge (MySQL 8)',
    status: 'healthy',
    latency: 14,
    uptime: '99.98% (14d 6h)',
    memory: '112 MB / 1024 MB',
    cpu: '1.2%',
    connections: 28,
    version: 'Laravel 12 / PHP 8.2',
  },
  {
    id: 'inventory-service',
    name: 'Inventory & Catalog Service',
    port: 8003,
    container: 'pos-inventory-service',
    database: 'codebridge (MySQL 8)',
    status: 'healthy',
    latency: 19,
    uptime: '99.99% (14d 6h)',
    memory: '135 MB / 1024 MB',
    cpu: '1.9%',
    connections: 36,
    version: 'Laravel 12 / PHP 8.2',
  },
  {
    id: 'sales-service',
    name: 'Sales, Shift & Payment Engine',
    port: 8006,
    container: 'pos-sales-service',
    database: 'codebridge (MySQL 8)',
    status: 'healthy',
    latency: 22,
    uptime: '99.97% (14d 6h)',
    memory: '145 MB / 1024 MB',
    cpu: '2.1%',
    connections: 44,
    version: 'Laravel 12 / PHP 8.2',
  },
  {
    id: 'mysql-db',
    name: 'Central MySQL Database',
    port: 3307,
    container: 'codebridge-mysql-db',
    database: 'codebridge',
    status: 'healthy',
    latency: 1,
    uptime: '99.99% (14d 6h)',
    memory: '211 MB / 2048 MB',
    cpu: '0.8%',
    connections: 52,
    version: 'MySQL 8.0',
  },
];
