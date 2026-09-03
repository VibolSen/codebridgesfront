'use client';

import React from 'react';
import { Calendar, User, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface PosShiftHistoryTableProps {
  shiftHistory: any[];
  loading: boolean;
  onViewSummary?: (shift: any) => void;
}

export function PosShiftHistoryTable({
  shiftHistory,
  loading,
  onViewSummary,
}: PosShiftHistoryTableProps) {
  if (loading) {
    return (
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-500" />
          <span>Shift Auditing History & Z-Reports</span>
        </h3>
        <span className="text-xs font-bold text-slate-400">
          {shiftHistory.length} recorded shifts
        </span>
      </div>

      {shiftHistory.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 font-medium">
          No historical shifts recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                <th className="pb-3">Shift ID</th>
                <th className="pb-3">Cashier</th>
                <th className="pb-3">Opened At</th>
                <th className="pb-3">Closed At</th>
                <th className="pb-3 text-right">Float</th>
                <th className="pb-3 text-right">Counted</th>
                <th className="pb-3 text-right">Variance</th>
                <th className="pb-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {shiftHistory.map((shift) => {
                const isClosed = shift.status === 'closed';
                const variance = Number(shift.cash_variance ?? shift.cash_difference ?? 0);

                return (
                  <tr key={shift.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-mono font-bold text-slate-900">
                      {String(shift.id || '').slice(0, 8)}...
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{shift.cashier_name || shift.user_name || 'Cashier'}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(shift.opened_at || shift.created_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 text-slate-500">
                      {shift.closed_at
                        ? new Date(shift.closed_at).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '— (Active)'}
                    </td>
                    <td className="py-3 text-right font-mono font-bold">
                      ${Number(shift.opening_float || 0).toFixed(2)}
                    </td>
                    <td className="py-3 text-right font-mono font-bold">
                      {shift.counted_cash ? `$${Number(shift.counted_cash).toFixed(2)}` : '—'}
                    </td>
                    <td className="py-3 text-right font-mono font-black">
                      {isClosed ? (
                        <span
                          className={
                            variance === 0
                              ? 'text-emerald-600'
                              : variance > 0
                              ? 'text-blue-600'
                              : 'text-rose-600'
                          }
                        >
                          {variance >= 0 ? `+$${variance.toFixed(2)}` : `-$${Math.abs(variance).toFixed(2)}`}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          isClosed
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {shift.status || 'closed'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
