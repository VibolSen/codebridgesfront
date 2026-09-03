'use client';

import React from 'react';
import { DollarSign, Receipt, TrendingUp, QrCode } from 'lucide-react';

interface PosReportsKpiGridProps {
  metrics: {
    grossSales: number;
    netSales: number;
    totalOrders: number;
    avgTicket: number;
    discountsGiven: number;
    refundsTotal: number;
    cashUsd: number;
    khqrSales: number;
    cardSales: number;
  };
}

export function PosReportsKpiGrid({ metrics }: PosReportsKpiGridProps) {
  const totalTender = (metrics.cashUsd || 0) + (metrics.khqrSales || 0) + (metrics.cardSales || 0);
  const khqrPct = totalTender > 0 ? Math.round(((metrics.khqrSales || 0) / totalTender) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Total Gross Sales */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-2">
        <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#5B4DFB]" />
            Gross Revenue
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black">Settled</span>
        </div>
        <p className="text-2xl font-black text-slate-900 font-mono">
          ${(metrics.grossSales || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-[11px] text-slate-400 font-medium">
          Net Sales: ${(metrics.netSales || 0).toFixed(2)}
        </p>
      </div>

      {/* Metric 2: Total Orders */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-2">
        <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
          <span className="flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-blue-600" />
            Completed Orders
          </span>
          <span className="text-[10px] text-slate-400 font-bold">100% Audited</span>
        </div>
        <p className="text-2xl font-black text-slate-900 font-mono">{metrics.totalOrders || 0}</p>
        <p className="text-[11px] text-slate-400 font-medium">
          Refunds: ${(metrics.refundsTotal || 0).toFixed(2)}
        </p>
      </div>

      {/* Metric 3: Average Ticket */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-2">
        <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            Average Basket
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black">Per Order</span>
        </div>
        <p className="text-2xl font-black text-slate-900 font-mono">${(metrics.avgTicket || 0).toFixed(2)}</p>
        <p className="text-[11px] text-slate-400 font-medium">
          Discounts: -${(metrics.discountsGiven || 0).toFixed(2)}
        </p>
      </div>

      {/* Metric 4: Bakong KHQR Volume */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-2">
        <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
          <span className="flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-rose-600" />
            NBC Bakong KHQR
          </span>
          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-black">{khqrPct}% Share</span>
        </div>
        <p className="text-2xl font-black text-rose-600 font-mono">
          ${(metrics.khqrSales || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-[11px] text-slate-400 font-medium">Instant ABA &amp; Bakong settlement</p>
      </div>
    </div>
  );
}
