'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Banknote,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  Printer,
  ShieldAlert,
  Calculator,
} from 'lucide-react';

interface PosShiftActiveCardProps {
  activeShift: any;
  onOpenShift: () => void;
  onCloseShift: () => void;
  onOpenCashMovement: (type: 'in' | 'out') => void;
  onPrintXReport?: () => void;
  onSafeDrop?: () => void;
  onDenominations?: () => void;
}

export function PosShiftActiveCard({
  activeShift,
  onOpenShift,
  onCloseShift,
  onOpenCashMovement,
  onPrintXReport,
  onSafeDrop,
  onDenominations,
}: PosShiftActiveCardProps) {
  if (!activeShift) {
    return (
      <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-sm text-amber-900">
              No Active Workstation Shift
            </h3>
            <p className="text-xs text-amber-700 mt-0.5">
              Open an active cash float to enable cashier register ringing and cash auditing.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenShift}
          className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Open New Shift</span>
        </button>
      </div>
    );
  }

  const openingFloat = Number(activeShift.opening_float || 0);
  const cashSales = Number(activeShift.cash_sales || 0);
  const cashIn = Number(activeShift.cash_in || 0);
  const cashOut = Number(activeShift.cash_out || 0);
  const safeDrops = Number(activeShift.safe_drops || 0);
  const expectedCash = openingFloat + cashSales + cashIn - cashOut - safeDrops;

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">Active Register Shift</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Auditing
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Shift ID: <span className="font-mono font-bold text-slate-700">{String(activeShift.id).slice(0, 8)}...</span> • Started {new Date(activeShift.opened_at || activeShift.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {onDenominations && (
            <button
              type="button"
              onClick={onDenominations}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-orange-500" />
              <span>Count Bills</span>
            </button>
          )}

          {onPrintXReport && (
            <button
              type="button"
              onClick={onPrintXReport}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>X-Report</span>
            </button>
          )}

          {onSafeDrop && (
            <button
              type="button"
              onClick={onSafeDrop}
              className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
              <span>Safe Drop</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenCashMovement('in')}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pay-In</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenCashMovement('out')}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
            <span>Pay-Out</span>
          </button>

          <button
            type="button"
            onClick={onCloseShift}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Close Shift</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Opening Float</p>
          <p className="text-xl font-black text-slate-900 mt-1 font-mono">${openingFloat.toFixed(2)}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Cash Sales</p>
          <p className="text-xl font-black text-emerald-600 mt-1 font-mono">+${cashSales.toFixed(2)}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pay-Ins / Drops</p>
          <p className="text-xl font-black text-slate-900 mt-1 font-mono">
            {cashIn - cashOut - safeDrops >= 0
              ? `+$${(cashIn - cashOut - safeDrops).toFixed(2)}`
              : `-$${Math.abs(cashIn - cashOut - safeDrops).toFixed(2)}`}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200">
          <p className="text-[11px] font-black text-orange-700 uppercase tracking-wider">Expected Drawer</p>
          <p className="text-xl font-black text-orange-600 mt-1 font-mono">${expectedCash.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
