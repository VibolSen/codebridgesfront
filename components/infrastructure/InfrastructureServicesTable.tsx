'use client';

import React from 'react';
import { Server, CheckCircle2 } from 'lucide-react';
import { ServiceStatus } from './types';

interface InfrastructureServicesTableProps {
  services: ServiceStatus[];
}

export function InfrastructureServicesTable({ services }: InfrastructureServicesTableProps) {
  return (
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
                    <div className="w-8 h-8 rounded-xl bg-brand-subtle text-brand flex items-center justify-center font-bold">
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
  );
}
