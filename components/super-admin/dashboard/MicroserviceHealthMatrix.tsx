'use client';

import React from 'react';
import { Server, Activity, Database, CheckCircle2, AlertCircle, RefreshCw, Cpu, Layers } from 'lucide-react';

interface ServiceStatus {
  name: string;
  port: number;
  db: string;
  uptime: string;
  latencyMs: number;
  status: 'healthy' | 'degraded' | 'down';
}

const SERVICES: ServiceStatus[] = [
  { name: 'auth-service', port: 8001, db: 'auth_db', uptime: '99.98%', latencyMs: 14, status: 'healthy' },
  { name: 'catalog-service', port: 8002, db: 'catalog_db', uptime: '99.95%', latencyMs: 18, status: 'healthy' },
  { name: 'inventory-service', port: 8003, db: 'inventory_db', uptime: '99.99%', latencyMs: 22, status: 'healthy' },
  { name: 'shift-service', port: 8004, db: 'shift_db', uptime: '99.97%', latencyMs: 16, status: 'healthy' },
  { name: 'payment-service', port: 8005, db: 'payment_db', uptime: '100%', latencyMs: 31, status: 'healthy' },
  { name: 'sales-service', port: 8006, db: 'sales_db', uptime: '99.96%', latencyMs: 25, status: 'healthy' },
];

export function MicroserviceHealthMatrix() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Microservices Infrastructure Telemetry</h3>
            <p className="text-xs text-slate-500 font-medium">Decoupled Database-per-Service Architecture (6/6 Healthy)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All Systems Operational
          </span>
        </div>
      </div>

      {/* Services Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {SERVICES.map((svc) => (
          <div
            key={svc.name}
            className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-800 truncate">{svc.name}</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 font-mono text-[9px]">
                  :{svc.port}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">DB: {svc.db}</p>
            </div>

            <div className="text-right shrink-0 space-y-0.5">
              <div className="flex items-center justify-end gap-1 text-[11px] font-extrabold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{svc.latencyMs}ms</span>
              </div>
              <span className="text-[9px] text-slate-500 font-semibold">{svc.uptime}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Messaging & Cache Telemetry Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-600" />
            <span className="font-bold text-slate-700">RabbitMQ Backlog</span>
          </div>
          <span className="font-mono font-extrabold text-orange-700">0 messages</span>
        </div>

        <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-rose-600" />
            <span className="font-bold text-slate-700">Redis Cache Memory</span>
          </div>
          <span className="font-mono font-extrabold text-rose-700">42.8 MB</span>
        </div>

        <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-700">MySQL Connection Pool</span>
          </div>
          <span className="font-mono font-extrabold text-blue-700">18 / 150 conn</span>
        </div>
      </div>
    </div>
  );
}
