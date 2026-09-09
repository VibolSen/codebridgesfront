'use client';

import React, { useState } from 'react';
import { Server, RefreshCw } from 'lucide-react';
import { INITIAL_SERVICES, ServiceStatus } from './types';
import { InfrastructureKpiCards } from './InfrastructureKpiCards';
import { InfrastructureServicesTable } from './InfrastructureServicesTable';

export function SuperAdminInfrastructureView() {
  const [services, setServices] = useState<ServiceStatus[]>(INITIAL_SERVICES);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'microservices' | 'databases'>('microservices');

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
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
      {/* Header */}
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
                <span>All 5 Containers Online</span>
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

      {/* Top Summary KPI Cards */}
      <InfrastructureKpiCards
        services={services}
        totalHealthy={totalHealthy}
        avgLatency={avgLatency}
      />

      {/* Tab Filter */}
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
          Active Containers ({services.length})
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
          Unified Database (codebridge)
        </button>
      </div>

      {/* Microservices Table */}
      <InfrastructureServicesTable services={services} />
    </div>
  );
}
