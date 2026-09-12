'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { AppIcons } from '@/components/ui/icons';
import { cardStyles } from '@/lib/theme';

interface LaunchpadStatsStripProps {
  staffCount: number;
  enabledModulesCount: number;
  totalModulesCount: number;
  activeShift: any | null;
  outletsCount: number;
}

export function LaunchpadStatsStrip({
  staffCount,
  enabledModulesCount,
  totalModulesCount,
  activeShift,
  outletsCount,
}: LaunchpadStatsStripProps) {
  return (
    <div className={`${cardStyles.base} p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100`}>
      {/* Stat 1: Members */}
      <div className="space-y-1 sm:px-3 first:pl-0">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
          <AppIcons.Staff className="w-3.5 h-3.5" />
          <span>Total Headcount</span>
        </div>
        <p className="text-2xl font-black text-slate-900 font-mono">{staffCount}</p>
        <p className="text-[11px] text-slate-400 font-medium">
          {staffCount === 1 ? '1 active user account' : `${staffCount} active user accounts`}
        </p>
      </div>

      {/* Stat 2: Active Modules */}
      <div className="space-y-1 sm:px-4 pt-4 sm:pt-0">
        <div className="flex items-center gap-1.5 text-brand text-xs font-bold">
          <AppIcons.Layers className="w-3.5 h-3.5" />
          <span>Enabled Services</span>
        </div>
        <p className="text-2xl font-black text-brand font-mono">{enabledModulesCount}</p>
        <p className="text-[11px] text-slate-400 font-medium">
          {enabledModulesCount} of {totalModulesCount} platform services active
        </p>
      </div>

      {/* Stat 3: Active Shift Status */}
      <div className="space-y-1 sm:px-4 pt-4 sm:pt-0">
        <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold">
          <AppIcons.Infrastructure className="w-3.5 h-3.5" />
          <span>Register Shift Status</span>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-black text-amber-600 font-mono">
            {activeShift ? '1 Open' : '0 Open'}
          </p>
          <span className="text-[10px] text-slate-400 font-bold">
            {activeShift ? 'Live Session' : 'Shift Idle'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 font-medium truncate">
          {activeShift ? `Register active by ${activeShift.user_name || 'Staff'}` : 'All registers closed / verified'}
        </p>
      </div>

      {/* Stat 4: Outlets Coverage */}
      <div className="space-y-1 sm:px-4 pt-4 sm:pt-0">
        <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Fleet Outlets</span>
        </div>
        <p className="text-2xl font-black text-emerald-600 font-mono">{outletsCount}</p>
        <p className="text-[11px] text-slate-400 font-medium">
          {outletsCount === 1 ? '1 physical outlet linked' : `${outletsCount} physical outlets linked`}
        </p>
      </div>
    </div>
  );
}
