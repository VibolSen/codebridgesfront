'use client';

import React from 'react';
import { Users, User } from 'lucide-react';

interface CashierPerformanceItem {
  id: string | number;
  name: string;
  role: string;
  orders: number;
  revenue: number;
  avgSpeed?: string;
}

interface PosReportsCashierVelocityTableProps {
  cashiers: CashierPerformanceItem[];
}

export function PosReportsCashierVelocityTable({ cashiers = [] }: PosReportsCashierVelocityTableProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-4 h-4 text-brand" />
          <span>Cashier Sales Velocity</span>
        </h3>
        <span className="text-[10px] font-bold text-slate-400">By Transactions</span>
      </div>

      {cashiers.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs font-medium">
          No cashier shift sales recorded in this period yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold text-[10px] uppercase">
                <th className="pb-2.5">Staff Member</th>
                <th className="pb-2.5 text-center">Orders</th>
                <th className="pb-2.5 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {cashiers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center">
                        {c.name ? c.name.slice(0, 2).toUpperCase() : 'CA'}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900">{c.name}</p>
                        <p className="text-[10px] text-slate-400 capitalize">{c.role?.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center font-mono font-bold text-slate-700">{c.orders}</td>
                  <td className="py-3 text-right font-mono font-black text-slate-900">${(Number(c.revenue) || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
