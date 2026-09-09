'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Copy, Check, Users, Plus } from 'lucide-react';

interface LaunchpadOrgBannerProps {
  user: any;
  roleTitle: string;
  displayOrgName: string;
  activeOrgId: string | number;
  copiedId: boolean;
  onCopyOrgId: () => void;
  enabledModulesCount: number;
  staffCount: number;
  outletsCount: number;
}

export function LaunchpadOrgBanner({
  user,
  roleTitle,
  displayOrgName,
  activeOrgId,
  copiedId,
  onCopyOrgId,
  enabledModulesCount,
  staffCount,
  outletsCount,
}: LaunchpadOrgBannerProps) {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const dateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* A. Localized Greeting */}
      <div className="space-y-1">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5B4DFB]" />
          <span>CodeBridges Core Suite</span>
        </p>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight" suppressHydrationWarning>
          {greeting}, {user?.name || 'Partner'}
        </h1>
        <p className="text-xs text-slate-400 font-medium" suppressHydrationWarning>
          {dateString}
        </p>
      </div>

      {/* B. Organization Identity Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F4F6FB] border border-slate-200/60 flex items-center justify-center shrink-0">
            <Building2 className="w-7 h-7 text-slate-700" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight" suppressHydrationWarning>
                {displayOrgName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-100" suppressHydrationWarning>
                {roleTitle}
              </span>
              {activeOrgId && (
                <button
                  type="button"
                  onClick={onCopyOrgId}
                  title={`Copy Identifier (${activeOrgId})`}
                  className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {/* Sub-Stats Strip */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
              <span>{enabledModulesCount} Active Module{enabledModulesCount === 1 ? '' : 's'}</span>
              <span>•</span>
              <span>{staffCount} {staffCount === 1 ? 'Assigned Staff' : 'Assigned Staff'}</span>
              <span>•</span>
              <span>{outletsCount} {outletsCount === 1 ? 'Store Outlet' : 'Store Outlets'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/hrm"
            className="px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-xs transition-colors flex items-center gap-1.5"
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span>Manage Staff</span>
          </Link>
          <Link
            href="/super-admin/platform/tenants"
            className="w-9 h-9 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            title="Add New Workspace"
          >
            <Plus className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
