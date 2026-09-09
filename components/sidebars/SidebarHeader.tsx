'use client';

import React from 'react';
import { Building2, AlertCircle } from 'lucide-react';

interface SidebarHeaderProps {
  orgName: string;
  roleName: string;
  activeShift: any;
  offlineCount: number;
}

export function SidebarHeader({
  orgName,
  roleName,
  activeShift,
  offlineCount,
}: SidebarHeaderProps) {
  return (
    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-2xl bg-[#5B4DFB] text-white flex items-center justify-center font-black shadow-sm shrink-0">
          <Building2 className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className="font-extrabold text-xs text-slate-900 truncate"
            title={orgName}
          >
            {orgName}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              POS Management System
            </span>
          </div>
        </div>
      </div>

      {/* Context Pill */}
      <div className="mt-3 flex items-center justify-between text-[11px] bg-white rounded-xl px-2.5 py-1.5 border border-slate-200/80 shadow-xs">
        <span className="font-bold text-slate-600 truncate">{roleName}</span>
        {activeShift ? (
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
            Shift Active
          </span>
        ) : (
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md shrink-0">
            Till Closed
          </span>
        )}
      </div>

      {offlineCount > 0 && (
        <div className="mt-2 text-[10px] font-bold text-amber-800 bg-amber-50 rounded-lg px-2 py-1 border border-amber-200 flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
          <span>{offlineCount} offline sales pending sync</span>
        </div>
      )}
    </div>
  );
}
