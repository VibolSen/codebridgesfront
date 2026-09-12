'use client';

import React from 'react';
import { Clock } from 'lucide-react';

interface HourlySalesItem {
  hour: string;
  orders: number;
  sales: number;
}

interface PosReportsHourlyVelocityProps {
  hourlySales: HourlySalesItem[];
}

export function PosReportsHourlyVelocity({ hourlySales = [] }: PosReportsHourlyVelocityProps) {
  const maxSales = Math.max(...hourlySales.map((h) => h.sales), 10);
  const peak = hourlySales.reduce(
    (prev, curr) => (curr.sales > prev.sales ? curr : prev),
    hourlySales[0] || { hour: '12:00', orders: 0, sales: 0 }
  );

  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand" />
            <span>Hourly Sales Volume &amp; Rush Hours</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium">Transaction flow across operating hours</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-brand-subtle text-brand text-[10px] font-black border border-brand/20">
          {peak.sales > 0 ? `Peak: ${peak.hour} ($${peak.sales.toFixed(2)})` : 'Real-time Flow'}
        </span>
      </div>

      {/* Hourly Vertical Bars */}
      <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
        {hourlySales.map((item) => {
          const heightPct = maxSales > 0 ? Math.round((item.sales / maxSales) * 100) : 0;
          return (
            <div key={item.hour} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-mono font-black text-slate-700">
                ${Math.round(item.sales)}
              </div>
              <div
                style={{ height: `${Math.max(item.sales > 0 ? heightPct : 4, 4)}%` }}
                className={`w-full rounded-xl transition-colors relative ${
                  item.sales > 0 ? 'bg-brand/20 group-hover:bg-brand' : 'bg-slate-100'
                }`}
              />
              <span className="text-[9px] font-bold text-slate-400 group-hover:text-slate-800">{item.hour.split(':')[0]}h</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
