'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, ArrowUpRight } from 'lucide-react';
import { GrowthPoint } from './useSuperAdminDashboard';

interface PlatformGrowthChartProps {
  growthData: GrowthPoint[];
  isLoading?: boolean;
}

export function PlatformGrowthChart({ growthData, isLoading = false }: PlatformGrowthChartProps) {
  const [metric, setMetric] = useState<'mrr' | 'orgs' | 'signups'>('mrr');

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] animate-pulse h-80 flex flex-col justify-between">
        <div className="h-6 bg-slate-100 rounded w-48" />
        <div className="flex items-end justify-between gap-3 h-48 px-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-1 bg-slate-100 rounded-xl h-36" />
          ))}
        </div>
      </div>
    );
  }

  const maxVal = Math.max(...growthData.map((d) => d[metric]), 1);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:border-slate-300/80 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F5F3FF] text-[#5B4DFB] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Platform Trajectory & Growth Cohorts</h3>
              <p className="text-xs text-slate-500 font-medium">Monthly trajectory aggregated from live tenant registrations</p>
            </div>
          </div>
        </div>

        {/* Metric Switcher */}
        <div className="flex p-1 bg-slate-100/80 rounded-xl text-xs font-bold self-start">
          <button
            type="button"
            onClick={() => setMetric('mrr')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              metric === 'mrr'
                ? 'bg-white text-[#5B4DFB] shadow-xs font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            MRR ($)
          </button>
          <button
            type="button"
            onClick={() => setMetric('orgs')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              metric === 'orgs'
                ? 'bg-white text-[#5B4DFB] shadow-xs font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Organizations
          </button>
          <button
            type="button"
            onClick={() => setMetric('signups')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              metric === 'signups'
                ? 'bg-white text-[#5B4DFB] shadow-xs font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            New Signups
          </button>
        </div>
      </div>

      {/* Dynamic Bar Chart Visualization */}
      <div className="mt-6 flex items-end justify-between gap-3 h-52 px-2">
        {growthData.map((d) => {
          const val = d[metric];
          const heightPct = Math.max(8, Math.round((val / maxVal) * 100));

          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              {/* Tooltip Value */}
              <div className="text-[11px] font-extrabold text-[#5B4DFB] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {metric === 'mrr' ? `$${val.toLocaleString()}` : val}
              </div>

              {/* Bar Container */}
              <div className="w-full max-w-[46px] bg-slate-100/70 group-hover:bg-slate-100 rounded-xl p-1 flex flex-col justify-end h-40 transition-colors">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-full bg-gradient-to-t from-[#5B4DFB] to-[#8B7EF8] rounded-lg group-hover:from-[#4E3FE3] group-hover:to-[#7566EB] transition-all shadow-xs"
                />
              </div>

              {/* Month Label */}
              <span className="text-[11px] font-extrabold text-slate-600 group-hover:text-slate-900 transition-colors">
                {d.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
