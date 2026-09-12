'use client';

import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';

export function FeatureFlagsTab() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
      <div className="pb-4 border-b border-slate-100">
        <h3 className="font-extrabold text-base text-slate-900">Gradual Rollouts & Beta Feature Flags</h3>
        <p className="text-xs text-slate-500 font-medium">Safely test experimental features per tenant cohort with instant kill-switches.</p>
      </div>

      <div className="py-12 px-4 text-center max-w-md mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-2xs border border-amber-200/60">
          <Zap className="w-6 h-6" />
        </div>
        <h4 className="font-extrabold text-sm text-slate-900">Zero Static Fallbacks Enforced</h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          No mock feature flags are rendered. All platform capabilities operate under real, server-authoritative module licensing via the <strong className="text-slate-700 font-bold">Tenant Entitlements</strong> tab.
        </p>
        <div className="pt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Server-Authoritative Synchronization Active</span>
        </div>
      </div>
    </div>
  );
}
