'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, DollarSign, Loader2 } from 'lucide-react';
import { getSalesReportApi, getExpensesApi } from '@/lib/api';

interface MonthMetric {
  month: string;
  revenue: number;
  expense: number;
  net: number;
}

export function CashFlowTrajectoryCard() {
  const [loading, setLoading] = useState(true);
  const [monthsData, setMonthsData] = useState<MonthMetric[]>([]);

  useEffect(() => {
    async function loadTrajectory() {
      try {
        setLoading(true);
        const [salesRes, expRes] = await Promise.allSettled([
          getSalesReportApi(),
          getExpensesApi(),
        ]);

        let currentRevenue = 0;
        if (salesRes.status === 'fulfilled' && salesRes.value?.data) {
          const s = salesRes.value.data;
          currentRevenue = parseFloat(s.total_sales || s.revenue || '0') || 0;
        }

        let currentExpenses = 0;
        if (expRes.status === 'fulfilled') {
          const expList = Array.isArray(expRes.value) ? expRes.value : expRes.value?.data || [];
          currentExpenses = expList.reduce(
            (acc: number, item: any) => acc + (parseFloat(item.amount || '0') || 0),
            0
          );
        }

        // Build live monthly timeline based on current real financial data
        const now = new Date();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonthIdx = now.getMonth();

        const timeline: MonthMetric[] = [];
        for (let i = 4; i >= 0; i--) {
          const mIdx = (currentMonthIdx - i + 12) % 12;
          const isCurrent = i === 0;
          const rev = isCurrent ? currentRevenue : 0;
          const exp = isCurrent ? currentExpenses : 0;
          timeline.push({
            month: monthNames[mIdx],
            revenue: rev,
            expense: exp,
            net: rev - exp,
          });
        }

        setMonthsData(timeline);
      } catch (err) {
        console.error('Failed to load cash flow trajectory:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTrajectory();
  }, []);

  const maxVal = Math.max(1, ...monthsData.map((m) => Math.max(m.revenue, m.expense)));

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900">Cash Flow &amp; P&amp;L Trajectory</h3>
          <p className="text-xs text-slate-500 font-medium">Monthly operating revenue vs expenses vs net margin</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="text-slate-600">Expenses</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-slate-600">Net Profit</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 font-semibold flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
          <span>Calculating live cash flow trajectory...</span>
        </div>
      ) : monthsData.every((m) => m.revenue === 0 && m.expense === 0) ? (
        <div className="py-14 text-center text-xs text-slate-400 font-medium">
          No sales revenue or expense transactions recorded in this fiscal period yet.
        </div>
      ) : (
        /* Bar Comparison Chart */
        <div className="flex items-end justify-between gap-4 h-48 px-2 pt-4">
          {monthsData.map((m) => {
            const revPct = Math.min(100, Math.max(4, Math.round((m.revenue / maxVal) * 100)));
            const expPct = Math.min(100, Math.max(4, Math.round((m.expense / maxVal) * 100)));
            const netVal = Math.max(0, m.net);
            const netPct = Math.min(100, Math.max(4, Math.round((netVal / maxVal) * 100)));

            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="flex items-end gap-1 w-full justify-center h-36">
                  <div
                    className="w-3 sm:w-4 bg-emerald-500 rounded-t-md transition-all shadow-xs"
                    style={{ height: m.revenue > 0 ? `${revPct}%` : '4px' }}
                    title={`Revenue: $${m.revenue.toLocaleString()}`}
                  />
                  <div
                    className="w-3 sm:w-4 bg-rose-400 rounded-t-md transition-all shadow-xs"
                    style={{ height: m.expense > 0 ? `${expPct}%` : '4px' }}
                    title={`Expenses: $${m.expense.toLocaleString()}`}
                  />
                  <div
                    className="w-3 sm:w-4 bg-purple-500 rounded-t-md transition-all shadow-xs"
                    style={{ height: m.net > 0 ? `${netPct}%` : '4px' }}
                    title={`Net: $${m.net.toLocaleString()}`}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-600">{m.month}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
