'use client';

import React from 'react';
import { SubscriptionPlan } from '@/components/finance/billing/types';
import { AppIcons } from '@/components/ui/icons';
import { buttonStyles, cardStyles } from '@/lib/theme';

interface SubscriptionCapacityTabProps {
  currentPlan?: SubscriptionPlan;
  onNavigateToPlans: () => void;
}

export function SubscriptionCapacityTab({
  currentPlan,
  onNavigateToPlans,
}: SubscriptionCapacityTabProps) {
  return (
    <div className="space-y-6">
      {/* Active Plan Overview Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-subtle via-purple-50/30 to-white border border-brand/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-brand">
            Current Workspace Tier
          </span>
          <h4 className="text-lg font-black text-slate-900">{currentPlan?.name || 'Pro Suite Tier'}</h4>
          <p className="text-xs text-slate-500 font-medium">
            Auto-renews dynamically on monthly cycle. Next cycle in 18 days.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xl font-black text-slate-900">${currentPlan?.priceMonthly || 49}</span>
            <span className="text-xs font-bold text-slate-400"> / month</span>
          </div>
          <button
            type="button"
            onClick={onNavigateToPlans}
            className={buttonStyles.primary}
          >
            Change Plan
          </button>
        </div>
      </div>

      {/* Google One Style Segmented Meter */}
      <div className={`${cardStyles.compact} p-5 space-y-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-black text-slate-900">Cloud Storage &amp; Enterprise Capacity</h4>
            <p className="text-[11px] text-slate-400 font-medium">
              Multi-tenant cloud resources allocated to your workspace
            </p>
          </div>
          <span className="text-xs font-extrabold text-brand">64% Total Quota Used</span>
        </div>

        {/* Segmented Color Bar */}
        <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5 p-0.5">
          <div className="h-full rounded-full bg-brand w-[35%]" title="Cloud Database Storage" />
          <div className="h-full rounded-full bg-cyan-500 w-[15%]" title="Branch Outlets" />
          <div className="h-full rounded-full bg-amber-500 w-[14%]" title="Staff & Terminal Accounts" />
        </div>

        {/* Quota Legend Items */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-subtle text-brand flex items-center justify-center shrink-0">
              <AppIcons.Storage className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Cloud DB Storage</p>
              <p className="text-xs font-black text-slate-900">17.5 GB / 50 GB</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
              <AppIcons.Outlets className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Store Outlets</p>
              <p className="text-xs font-black text-slate-900">
                2 of {currentPlan?.maxOutlets || 5} Active
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AppIcons.Staff className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Cashier &amp; Staff</p>
              <p className="text-xs font-black text-slate-900">
                8 of {currentPlan?.maxStaff || 15} Seats
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
