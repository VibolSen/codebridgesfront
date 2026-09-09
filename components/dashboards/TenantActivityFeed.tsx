'use client';

import React from 'react';
import {
  Activity,
  Sparkles,
  CreditCard,
  Lock,
  Layers,
  ShieldCheck,
  Clock,
  Terminal,
} from 'lucide-react';
import Link from 'next/link';
import { AuditActivity } from './useSuperAdminDashboard';

interface TenantActivityFeedProps {
  auditLogs: AuditActivity[];
  isLoading?: boolean;
}

export function TenantActivityFeed({ auditLogs, isLoading = false }: TenantActivityFeedProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] animate-pulse h-80 space-y-4">
        <div className="h-6 bg-slate-100 rounded w-48" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="h-2 bg-slate-100 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:border-slate-300/80 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Live Audit & Activity Stream</h3>
              <p className="text-xs text-slate-500 font-medium">Immutable audit trail from the core platform engine</p>
            </div>
          </div>
          <Link
            href="/super-admin/security/audit-logs"
            className="text-xs font-extrabold text-[#5B4DFB] hover:text-[#4E3FE3] transition-colors"
          >
            Audit Logs →
          </Link>
        </div>

        {auditLogs.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-xs font-bold text-slate-700">No Recent Audit Events</p>
            <p className="text-[11px] text-slate-400 max-w-[220px]">
              System actions, mutations, and supervisor authorizations will stream here live.
            </p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-slate-100">
            {auditLogs.slice(0, 5).map((act) => (
              <div key={act.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F5F3FF] text-[#5B4DFB] flex items-center justify-center shrink-0 mt-0.5 border border-[#DDD6FE]/60">
                  <Terminal className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-slate-900 truncate">{act.action}</span>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {act.timeAgo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate leading-relaxed">
                    By <strong className="text-slate-700 font-semibold">{act.userName}</strong> ({act.ipAddress})
                  </p>
                  <div className="pt-0.5 flex items-center gap-1.5">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono font-bold text-[9px] uppercase tracking-wide">
                      {act.module}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Real-time Audit Logger Active
        </span>
        <span className="font-mono text-[10px]">100% Immutable</span>
      </div>
    </div>
  );
}
