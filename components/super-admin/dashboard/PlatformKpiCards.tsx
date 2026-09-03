'use client';

import React from 'react';
import {
  Building2,
  DollarSign,
  TrendingUp,
  Users,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface PlatformKpiCardsProps {
  stats?: {
    totalOrgs?: number;
    activeOrgs?: number;
    trialOrgs?: number;
    churnedOrgs?: number;
    mrr?: number;
    arr?: number;
    mrrGrowth?: number;
    signupsToday?: number;
    signupsWeek?: number;
    signupsMonth?: number;
    flaggedAccounts?: number;
    failedInvoices?: number;
    openTickets?: number;
  };
}

export function PlatformKpiCards({ stats }: PlatformKpiCardsProps) {
  const totalOrgs = stats?.totalOrgs ?? 128;
  const activeOrgs = stats?.activeOrgs ?? 108;
  const trialOrgs = stats?.trialOrgs ?? 16;
  const churnedOrgs = stats?.churnedOrgs ?? 4;
  const mrr = stats?.mrr ?? 14850;
  const arr = stats?.arr ?? 178200;
  const mrrGrowth = stats?.mrrGrowth ?? 14.8;
  const signupsToday = stats?.signupsToday ?? 7;
  const signupsWeek = stats?.signupsWeek ?? 34;
  const signupsMonth = stats?.signupsMonth ?? 112;
  const flaggedAccounts = stats?.flaggedAccounts ?? 2;
  const failedInvoices = stats?.failedInvoices ?? 3;
  const openTickets = stats?.openTickets ?? 5;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Organizations */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Organizations</span>
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">{totalOrgs}</span>
          <span className="text-xs font-bold text-emerald-600 flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12%
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
          <span className="text-emerald-600 font-bold">{activeOrgs} Active</span>
          <span className="text-amber-600 font-bold">{trialOrgs} Trials</span>
          <span className="text-slate-400">{churnedOrgs} Churned</span>
        </div>
      </div>

      {/* 2. MRR & Total Revenue */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Recurring (MRR)</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">${mrr.toLocaleString()}</span>
          <span className="text-xs font-bold text-emerald-600 flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5" /> +{mrrGrowth}%
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
          <span>ARR: <strong className="text-slate-800">${arr.toLocaleString()}</strong></span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-extrabold">Healthy</span>
        </div>
      </div>

      {/* 3. New Signups Velocity */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Signups Velocity</span>
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">{signupsMonth}</span>
          <span className="text-xs font-bold text-blue-600">This Month</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
          <span>Today: <strong className="text-slate-800">+{signupsToday}</strong></span>
          <span>7 Days: <strong className="text-slate-800">+{signupsWeek}</strong></span>
        </div>
      </div>

      {/* 4. Attention & Support Queue */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attention & Support</span>
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-600">{flaggedAccounts + failedInvoices}</span>
          <span className="text-xs font-bold text-slate-500">Items Pending</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
          <span className="text-rose-600 font-bold">{failedInvoices} Failed Payments</span>
          <span className="text-slate-600">{openTickets} Tickets</span>
        </div>
      </div>
    </div>
  );
}
