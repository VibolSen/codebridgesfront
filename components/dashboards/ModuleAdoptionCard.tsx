'use client';

import React from 'react';
import { Layers, Monitor, Boxes, DollarSign, Users, Briefcase, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import { ModuleAdoptionMetric } from './useSuperAdminDashboard';

interface ModuleAdoptionCardProps {
  moduleStats: ModuleAdoptionMetric[];
  isLoading?: boolean;
}

const MODULE_ICONS: Record<string, any> = {
  pos: Monitor,
  inventory: Boxes,
  finance: DollarSign,
  hrm: Briefcase,
  crm: Users,
  kds: UtensilsCrossed,
};

export function ModuleAdoptionCard({ moduleStats, isLoading = false }: ModuleAdoptionCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] animate-pulse h-80 space-y-4">
        <div className="h-6 bg-slate-100 rounded w-40" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-slate-100 rounded w-3/4" />
            <div className="h-2 bg-slate-100 rounded w-full" />
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
            <div className="w-8 h-8 rounded-xl bg-[#F5F3FF] text-[#5B4DFB] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Module Ecosystem Adoption</h3>
              <p className="text-xs text-slate-500 font-medium">Enabled suites across registered enterprise tenants</p>
            </div>
          </div>
          <Link
            href="/super-admin/platform/modules"
            className="text-xs font-extrabold text-[#5B4DFB] hover:text-[#4E3FE3] transition-colors"
          >
            Registry →
          </Link>
        </div>

        <div className="mt-4 space-y-3.5">
          {moduleStats.map((mod) => {
            const pct = Math.round((mod.count / mod.totalOrgs) * 100) || 0;
            const IconComp = MODULE_ICONS[mod.id] || Layers;

            return (
              <div key={mod.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <span className={`w-6 h-6 rounded-lg ${mod.bgColor} ${mod.textColor} flex items-center justify-center shrink-0`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">{mod.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-slate-500 text-[11px] shrink-0">
                    <span>{mod.count} orgs</span>
                    <span className="font-black text-slate-900 font-mono">({pct}%)</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${mod.color} transition-all duration-500`}
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>Provisioned via tenant policy</span>
        <span className="font-bold text-[#5B4DFB]">Instant Multi-Tenant</span>
      </div>
    </div>
  );
}
