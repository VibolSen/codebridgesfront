'use client';

import React from 'react';

interface ShiftReportTabProps {
  shiftData: any;
}

export function ShiftReportTab({ shiftData }: ShiftReportTabProps) {
  if (!shiftData) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Shifts Recorded</span>
          <p className="text-3xl font-black text-slate-900 font-mono">{shiftData.summary?.total_shifts ?? 0}</p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Opening Float Total</span>
          <p className="text-3xl font-black text-slate-700 font-mono">
            ${shiftData.summary?.total_opening_float?.toFixed(2) ?? '0.00'}
          </p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Cash Drawer Variance</span>
          <p className="text-3xl font-black text-amber-600 font-mono">
            ${shiftData.summary?.net_variance?.toFixed(2) ?? '0.00'}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Recent Cashier Shifts Log</h3>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Shift ID</th>
              <th className="py-2.5 px-3">Float ($)</th>
              <th className="py-2.5 px-3">Expected Cash ($)</th>
              <th className="py-2.5 px-3">Actual Cash ($)</th>
              <th className="py-2.5 px-3">Variance ($)</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(shiftData.shifts || []).map((sh: any) => (
              <tr key={sh.id} className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                  {typeof sh.id === 'string' ? `${sh.id.substring(0, 8)}...` : sh.id}
                </td>
                <td className="py-2.5 px-3 font-semibold">${Number(sh.opening_float).toFixed(2)}</td>
                <td className="py-2.5 px-3 font-semibold">${Number(sh.expected_cash || 0).toFixed(2)}</td>
                <td className="py-2.5 px-3 font-semibold">${Number(sh.actual_cash || 0).toFixed(2)}</td>
                <td className="py-2.5 px-3 font-bold text-amber-600">${Number(sh.variance || 0).toFixed(2)}</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                    {sh.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
