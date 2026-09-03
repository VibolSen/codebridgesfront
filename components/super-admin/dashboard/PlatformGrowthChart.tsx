'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';

interface GrowthPoint {
  month: string;
  mrr: number;
  orgs: number;
  signups: number;
}

const GROWTH_DATA: GrowthPoint[] = [
  { month: 'Mar', mrr: 8400, orgs: 64, signups: 18 },
  { month: 'Apr', mrr: 9800, orgs: 78, signups: 22 },
  { month: 'May', mrr: 11200, orgs: 91, signups: 26 },
  { month: 'Jun', mrr: 12600, orgs: 104, signups: 29 },
  { month: 'Jul', mrr: 13900, orgs: 116, signups: 32 },
  { month: 'Aug', mrr: 14850, orgs: 128, signups: 34 },
];

export function PlatformGrowthChart() {
  const [metric, setMetric] = useState<'mrr' | 'orgs' | 'signups'>('mrr');
  const maxVal = Math.max(...GROWTH_DATA.map((d) => d[metric]));

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm text-slate-900">Platform Growth & Revenue Trajectory</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +76% H1 Growth
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Monthly trajectory of MRR and multi-tenant expansion</p>
        </div>

        {/* Metric Toggles */}
        <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-bold self-start">
          <button
            onClick={() => setMetric('mrr')}
            className={`px-3 py-1 rounded-lg transition-all ${
              metric === 'mrr' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            MRR ($)
          </button>
          <button
            onClick={() => setMetric('orgs')}
            className={`px-3 py-1 rounded-lg transition-all ${
              metric === 'orgs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Organizations
          </button>
          <button
            onClick={() => setMetric('signups')}
            className={`px-3 py-1 rounded-lg transition-all ${
              metric === 'signups' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Signups
          </button>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="mt-6 flex items-end justify-between gap-3 h-48 px-2">
        {GROWTH_DATA.map((d) => {
          const val = d[metric];
          const heightPct = Math.round((val / maxVal) * 100);
          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {metric === 'mrr' ? `$${val.toLocaleString()}` : val}
              </div>
              <div className="w-full max-w-[42px] bg-slate-100 rounded-xl p-0.5 flex flex-col justify-end h-36">
                <div
                  className="w-full bg-gradient-to-t from-orange-500 to-amber-400 rounded-lg group-hover:from-orange-600 group-hover:to-amber-500 transition-all duration-300 shadow-xs"
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-600">{d.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
