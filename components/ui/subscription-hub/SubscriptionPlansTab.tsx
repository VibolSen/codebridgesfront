'use client';

import React from 'react';
import { SubscriptionPlan } from '@/components/finance/billing/types';
import { AppIcons } from '@/components/ui/icons';
import { buttonStyles, cardStyles, badgeStyles } from '@/lib/theme';

interface SubscriptionPlansTabProps {
  plans: SubscriptionPlan[];
  currentPlan?: SubscriptionPlan;
  billingPeriod: 'monthly' | 'annual';
  onToggleBillingPeriod: (period: 'monthly' | 'annual') => void;
}

export function SubscriptionPlansTab({
  plans,
  currentPlan,
  billingPeriod,
  onToggleBillingPeriod,
}: SubscriptionPlansTabProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-black text-slate-900">Select Plan Tier</h4>
          <p className="text-xs text-slate-400 font-medium">Upgrade anytime as your store fleet expands</p>
        </div>
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onToggleBillingPeriod('monthly')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              billingPeriod === 'monthly'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => onToggleBillingPeriod('annual')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              billingPeriod === 'annual'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Annual (Save 20%)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => {
          const isCurrent = p.id === currentPlan?.id;
          const price = billingPeriod === 'monthly' ? p.priceMonthly : p.priceAnnual;
          return (
            <div
              key={p.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                isCurrent
                  ? cardStyles.selected
                  : `${cardStyles.compact} hover:border-slate-300`
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-black text-sm text-slate-900">{p.name}</h5>
                  {isCurrent && (
                    <span className={badgeStyles.brand}>Current</span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">${price}</span>
                  <span className="text-xs font-bold text-slate-400">
                    /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-1.5">
                    <AppIcons.Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Up to {p.maxOutlets} Outlets</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <AppIcons.Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Up to {p.maxStaff} Staff Accounts</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <AppIcons.Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{p.modulesIncluded.length} Integrated Modules</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                disabled={isCurrent}
                className={`mt-5 w-full ${isCurrent ? 'bg-slate-100 text-slate-400 cursor-not-allowed py-2 rounded-xl text-xs font-bold' : buttonStyles.primary}`}
              >
                {isCurrent ? 'Active Plan' : 'Switch to Plan'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
