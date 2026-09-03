'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Database,
  Layers,
  Zap,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  HardDrive,
  Network,
} from 'lucide-react';

interface ServiceStatus {
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

const INITIAL_SERVICES: ServiceStatus[] = [
  {
    id: 'gateway',
    name: 'Nginx API Gateway',
    port: 8080,
    container: 'codebridges_gateway',
    database: 'N/A (Reverse Proxy)',
    status: 'healthy',
    latency: 2,
    uptime: '99.99% (14d 6h)',
    memory: '38 MB / 512 MB',
    cpu: '0.4%',
    connections: 142,
    version: '1.25.4-alpine',
  },
  {
    id: 'auth-service',
    name: 'Auth & Identity Service',
    port: 8001,
    container: 'codebridges_auth_service',
    database: 'auth_db (MySQL 8)',
    status: 'healthy',
    latency: 14,
    uptime: '99.98% (14d 6h)',
    memory: '112 MB / 1024 MB',
    cpu: '1.2%',
    connections: 28,
    version: 'Laravel 12 / PHP 8.2',
  },
  {
    id: 'catalog-service',
    name: 'Catalog & Products Service',
    port: 8002,
    container: 'codebridges_catalog_service',
    database: 'catalog_db (MySQL 8)',
    status: 'healthy',
    latency: 18,
    uptime: '99.95% (14d 6h)',
    memory: '124 MB / 1024 MB',
    cpu: '1.8%',
    connections: 34,
    version: 'Laravel 12 / PHP 8.2',
  },
  {
    id: 'inventory-service',
    name: 'Inventory & Logistics Service',
    port: 8003,
    container: 'codebridges_inventory_service',
    database: 'inventory_db (MySQL 8)',
    status: 'healthy',
    latency: 21,
    uptime: '99.94% (14d 6h)',
    memory: '142 MB / 1024 MB',
    cpu: '2.4%',
    connections: 42,
    version: 'Laravel 12 / PHP 8.2',
  },
  {
    id: 'shift-service',
    name: 'Shifts & Register Till Service',
    port: 8004,
    container: 'codebridges_shift_service',
    database: 'shift_db (MySQL 8)',
    status: 'healthy',
    latency: 16,
    uptime: '99.99% (14d 6h)',
    memory: '98 MB / 1024 MB',
    cpu: '0.9%',
    connections: 19,
    version: 'Laravel 12 / PHP 8.2',
  },
  {
    id: 'payment-service',
    name: 'Payment & KHQR Service',
    port: 8005,
    container: 'codebridges_payment_service',
    database: 'payment_db (MySQL 8)',
    status: 'healthy',
    latency: 28,
    uptime: '99.99% (14d 6h)',
    memory: '106 MB / 1024 MB',
    cpu: '1.5%',
    connections: 24,
    version: 'Laravel 12 / PHP 8.2',
  },
  {
    id: 'sales-service',
    name: 'Sales & Checkout Service',
    port: 8006,
    container: 'codebridges_sales_service',
    database: 'sales_db (MySQL 8)',
    status: 'healthy',
    latency: 24,
    uptime: '99.97% (14d 6h)',
    memory: '138 MB / 1024 MB',
    cpu: '2.1%',
    connections: 48,
    version: 'Laravel 12 / PHP 8.2',
  },
];

export default function InfrastructureTelemetryPage() {
  const [services, setServices] = useState<ServiceStatus[]>(INITIAL_SERVICES);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'microservices' | 'queues' | 'databases'>('microservices');

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // Simulate live ping fluctuations
      setServices((prev) =>
        prev.map((s) => ({
          ...s,
          latency: Math.max(2, s.latency + Math.floor(Math.random() * 7) - 3),
          connections: Math.max(10, s.connections + Math.floor(Math.random() * 5) - 2),
        }))
      );
      setLastRefreshed(new Date());
      setRefreshing(false);
    }, 600);
  };

  const totalHealthy = services.filter((s) => s.status === 'healthy').length;
  const avgLatency = Math.round(
    services.reduce((acc, curr) => acc + curr.latency, 0) / services.length
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* 1. Header with Live Ping Refresh */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 p-0.5 shadow-md shadow-orange-500/15 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Server className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Infrastructure &amp; Telemetry Hub
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>All 7 Containers Online</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Live heartbeat telemetry, container memory limits, database connection pools, and API latency benchmarks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
            Updated: {lastRefreshed.toLocaleTimeString()}
          </span>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Pinging Nodes...' : 'Ping Cluster'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards (Section 11 of unique.md) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -4 }}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cluster Health</p>
            <p className="text-2xl font-black text-slate-900">
              {totalHealthy} / {services.length}
            </p>
            <p className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>100% Operational</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Gateway Latency</p>
            <p className="text-2xl font-black text-slate-900">{avgLatency} ms</p>
            <p className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>P99: &lt; 35ms Benchmark</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <Zap className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Redis Cache Status</p>
            <p className="text-2xl font-black text-slate-900">99.8%</p>
            <p className="text-[11px] font-extrabold text-teal-600 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>Hit Ratio (18 MB used)</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <HardDrive className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">RabbitMQ Event Queue</p>
            <p className="text-2xl font-black text-slate-900">0 msgs</p>
            <p className="text-[11px] font-extrabold text-blue-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>0 Dead-Letter Backlog</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Network className="w-6 h-6" />
          </div>
        </motion.div>
      </div>

      {/* 3. Tab Filter */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 w-fit text-xs font-extrabold">
        <button
          type="button"
          onClick={() => setActiveTab('microservices')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'microservices'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Microservices Cluster (7)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('databases')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'databases'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Database Pools (MySQL 8)
        </button>
      </div>

      {/* 4. Microservices Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-400 uppercase tracking-wider font-extrabold text-[10px]">
              <tr>
                <th className="px-6 py-4">Service &amp; Port</th>
                <th className="px-6 py-4">Docker Container</th>
                <th className="px-6 py-4">Database Slice</th>
                <th className="px-6 py-4">Latency</th>
                <th className="px-6 py-4">RAM / CPU</th>
                <th className="px-6 py-4">Pool Conns</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                        <Server className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900">{s.name}</p>
                        <p className="text-[10px] font-mono text-slate-400">Port :{s.port}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-slate-600">
                    {s.container}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                      {s.database}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-extrabold text-emerald-600">{s.latency} ms</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-slate-800">{s.memory}</p>
                      <p className="text-[10px] text-slate-400">CPU: {s.cpu}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {s.connections} active
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[10px] uppercase border border-emerald-200 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Online</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
