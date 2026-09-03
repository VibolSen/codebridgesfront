'use client';

import React from 'react';
import {
  Activity,
  Building2,
  Sparkles,
  CreditCard,
  Lock,
  Layers,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  type: 'signup' | 'subscription' | 'module_enable' | 'impersonation';
  title: string;
  detail: string;
  timeAgo: string;
  tenantName: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'signup',
    title: 'New Organization Created',
    detail: 'Phnom Penh Specialty Roasters registered for 14-day Enterprise trial.',
    timeAgo: '12m ago',
    tenantName: 'PP Roasters Co.',
  },
  {
    id: 'act-2',
    type: 'subscription',
    title: 'Subscription Upgraded to Growth Tier',
    detail: 'Bayon Fresh Supermarket upgraded from Starter ($49/mo) to Growth ($149/mo).',
    timeAgo: '45m ago',
    tenantName: 'Bayon Fresh Market',
  },
  {
    id: 'act-3',
    type: 'module_enable',
    title: 'Module Activated: CRM & Pipeline',
    detail: 'Angkor Tech Solutions enabled CRM & Lead Tracking module.',
    timeAgo: '2h ago',
    tenantName: 'Angkor Tech',
  },
  {
    id: 'act-4',
    type: 'impersonation',
    title: 'Audited Impersonation Session',
    detail: 'Super Admin (alex@codebridges.io) logged in as tenant for POS config support.',
    timeAgo: '3h ago',
    tenantName: 'Mekong Bistro',
  },
];

export function TenantActivityFeed() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Platform Activity & Audit Stream</h3>
            <p className="text-xs text-slate-500 font-medium">Real-time tenant lifecycle events and administrator actions</p>
          </div>
        </div>
        <Link
          href="/super-admin/security/audit-logs"
          className="text-xs font-bold text-orange-600 hover:text-orange-700"
        >
          Full Audit Log →
        </Link>
      </div>

      <div className="mt-4 divide-y divide-slate-100">
        {ACTIVITIES.map((act) => (
          <div key={act.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
              {act.type === 'signup' && <Sparkles className="w-3.5 h-3.5 text-orange-500" />}
              {act.type === 'subscription' && <CreditCard className="w-3.5 h-3.5 text-emerald-600" />}
              {act.type === 'module_enable' && <Layers className="w-3.5 h-3.5 text-purple-600" />}
              {act.type === 'impersonation' && <Lock className="w-3.5 h-3.5 text-amber-600" />}
            </div>

            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-slate-900 truncate">{act.title}</span>
                <span className="text-[10px] text-slate-400 font-semibold shrink-0">{act.timeAgo}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{act.detail}</p>
              <div className="pt-0.5">
                <span className="inline-block px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium text-[10px]">
                  {act.tenantName}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
