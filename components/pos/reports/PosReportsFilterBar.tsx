'use client';

import React from 'react';

interface PosReportsFilterBarProps {
  period: 'today' | 'yesterday' | '7d' | '30d' | 'custom';
  onPeriodChange: (period: 'today' | 'yesterday' | '7d' | '30d' | 'custom') => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  selectedOutlet: string;
  onOutletChange: (outletId: string) => void;
  outlets: any[];
}

export function PosReportsFilterBar({
  period,
  onPeriodChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  selectedOutlet,
  onOutletChange,
  outlets,
}: PosReportsFilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
      {/* Preset Period Buttons */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
        {[
          { id: 'today', label: 'Today' },
          { id: 'yesterday', label: 'Yesterday' },
          { id: '7d', label: 'Last 7 Days' },
          { id: '30d', label: 'Last 30 Days' },
          { id: 'custom', label: 'Custom' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onPeriodChange(item.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              period === item.id ? 'bg-white text-[#5B4DFB] shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Date Inputs & Outlet Selector */}
      <div className="flex items-center gap-2">
        {period === 'custom' && (
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-xs font-bold">
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none"
            />
          </div>
        )}

        {outlets.length > 0 && (
          <select
            value={selectedOutlet}
            onChange={(e) => onOutletChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none"
          >
            <option value="all">All Outlets</option>
            {outlets.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
