'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Zap, Activity, HardDrive, Database } from 'lucide-react';
import { ServiceStatus } from './types';

interface InfrastructureKpiCardsProps {
  services: ServiceStatus[];
  totalHealthy: number;
  avgLatency: number;
}

export function InfrastructureKpiCards({
  services,
  totalHealthy,
  avgLatency,
}: InfrastructureKpiCardsProps) {
  return (
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
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Host Footprint</p>
          <p className="text-2xl font-black text-slate-900">5 Containers</p>
          <p className="text-[11px] font-extrabold text-teal-600 flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span>Lean (4.0 GB+ Reclaimed)</span>
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
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">MySQL Architecture</p>
          <p className="text-2xl font-black text-slate-900">codebridge</p>
          <p className="text-[11px] font-extrabold text-blue-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Unified Single Database</span>
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <Database className="w-6 h-6" />
        </div>
      </motion.div>
    </div>
  );
}
