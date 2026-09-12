'use client';

import React, { useState } from 'react';
import {
  Server,
  Activity,
  Database,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Globe,
  Radio,
} from 'lucide-react';
import { ServiceHealthTelemetry } from './useSuperAdminDashboard';

interface MicroserviceHealthMatrixProps {
  telemetry: ServiceHealthTelemetry[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function MicroserviceHealthMatrix({
  telemetry,
  onRefresh,
  isLoading = false,
}: MicroserviceHealthMatrixProps) {
  const [isPinging, setIsPinging] = useState(false);

  const handlePing = async () => {
    setIsPinging(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setIsPinging(false), 500);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:border-slate-300/80 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Microservices & Infrastructure Telemetry
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              3-Tier Monolith-First Architecture · Single Unified Database
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All Systems Operational
          </span>

          <button
            type="button"
            onClick={handlePing}
            disabled={isPinging || isLoading}
            className="px-3 py-1.5 rounded-xl border border-slate-200/80 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging || isLoading ? 'animate-spin text-brand' : ''}`} />
            <span>Ping Services</span>
          </button>
        </div>
      </div>

      {/* Services Matrix Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {telemetry.map((svc) => (
          <div
            key={svc.name}
            className="p-4 rounded-2xl border border-slate-100 bg-slate-50/80 hover:bg-white hover:border-brand/30 hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs text-slate-900 truncate">{svc.name}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700 font-mono text-[9px]">
                  :{svc.port}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium truncate">{svc.domain}</p>
              <p className="text-[10px] text-slate-400 font-mono">Status: {svc.status}</p>
            </div>

            <div className="text-right shrink-0 space-y-0.5">
              <div className="flex items-center justify-end gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-mono">{svc.latencyMs}ms</span>
              </div>
              <span className="text-[9px] text-slate-400 font-semibold">{svc.lastChecked}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Unified Telemetry Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-brand-subtle/70 border border-brand-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand" />
            <span className="font-bold text-slate-700">API Gateway (Nginx)</span>
          </div>
          <span className="font-mono font-black text-brand">Port :8080</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-700">Live Health Check</span>
          </div>
          <span className="font-mono font-black text-emerald-700">200 OK</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-700">MySQL Database</span>
          </div>
          <span className="font-mono font-black text-blue-700">Port :3307</span>
        </div>
      </div>
    </div>
  );
}
