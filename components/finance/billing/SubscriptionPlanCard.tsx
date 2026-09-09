'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Sliders } from 'lucide-react';
import { SubscriptionPlan } from './types';

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  billingPeriod: 'monthly' | 'annual';
  onConfigure: (planName: string) => void;
}

export function SubscriptionPlanCard({
  plan,
  billingPeriod,
  onConfigure,
}: SubscriptionPlanCardProps) {
  const price = billingPeriod === 'monthly' ? plan.priceMonthly : plan.priceAnnual;
  const cadence = billingPeriod === 'monthly' ? '/month' : '/year';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`p-6 sm:p-8 rounded-3xl border-2 transition-all flex flex-col justify-between relative shadow-sm ${
        plan.popular
          ? 'border-orange-500 bg-white ring-2 ring-orange-500/15'
          : 'border-slate-200 bg-white'
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Most Popular Tier</span>
        </span>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="font-black text-lg text-slate-900">{plan.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {plan.activeTenantsCount} active store organizations
          </p>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-slate-900 font-mono">${price}</span>
          <span className="text-xs text-slate-400 font-bold">{cadence}</span>
        </div>

        <hr className="border-slate-100" />

        {/* Quota Limits */}
        <div className="space-y-2 text-xs">
          <p className="font-black text-slate-900 uppercase text-[10px] tracking-wider">Resource Quotas</p>
          <div className="flex justify-between text-slate-600">
            <span>Store Outlets:</span>
            <strong className="text-slate-900">{plan.maxOutlets} Max</strong>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Register Terminals:</span>
            <strong className="text-slate-900">{plan.maxRegisters} Max</strong>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Staff Accounts:</span>
            <strong className="text-slate-900">{plan.maxStaff} Max</strong>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Included Features */}
        <div className="space-y-2 text-xs">
          <p className="font-black text-slate-900 uppercase text-[10px] tracking-wider">Included Services</p>
          {plan.modulesIncluded.map((mod) => (
            <div key={mod} className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium">{mod}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 mt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onConfigure(plan.name)}
          className={`w-full py-3 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            plan.popular
              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Configure Plan Tier</span>
        </button>
      </div>
    </motion.div>
  );
}
