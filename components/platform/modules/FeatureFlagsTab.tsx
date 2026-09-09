'use client';

import React from 'react';
import { FeatureFlag } from './types';

interface FeatureFlagsTabProps {
  flagsList: FeatureFlag[];
  onFlagStatusChange: (flagId: string, newStatus: 'enabled_all' | 'beta_only' | 'disabled') => void;
}

export function FeatureFlagsTab({ flagsList, onFlagStatusChange }: FeatureFlagsTabProps) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
      <div className="pb-4 border-b border-slate-100">
        <h3 className="font-extrabold text-base text-slate-900">Gradual Rollouts & Beta Feature Flags</h3>
        <p className="text-xs text-slate-500 font-medium">Safely test experimental features per tenant cohort with instant kill-switches.</p>
      </div>

      <div className="space-y-4">
        {flagsList.map((flag) => (
          <div
            key={flag.id}
            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm text-slate-900">{flag.name}</h4>
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] font-bold">
                  {flag.key}
                </span>
              </div>
              <p className="text-xs text-slate-500">{flag.description}</p>
              <span className="text-[11px] font-semibold text-slate-400">
                Active in: <strong>{flag.betaTenantsCount}</strong> workspaces
              </span>
            </div>

            {/* Rollout Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl self-start md:self-center shrink-0">
              <button
                onClick={() => onFlagStatusChange(flag.id, 'disabled')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  flag.status === 'disabled'
                    ? 'bg-rose-100 text-rose-800 font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Disabled (OFF)
              </button>
              <button
                onClick={() => onFlagStatusChange(flag.id, 'beta_only')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  flag.status === 'beta_only'
                    ? 'bg-purple-100 text-purple-800 font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Beta Cohort Only
              </button>
              <button
                onClick={() => onFlagStatusChange(flag.id, 'enabled_all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  flag.status === 'enabled_all'
                    ? 'bg-emerald-100 text-emerald-800 font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                100% Global Rollout
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
