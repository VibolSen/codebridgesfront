'use client';

import React from 'react';

interface SalesReportTabProps {
  salesData: any;
}

export function SalesReportTab({ salesData }: SalesReportTabProps) {
  if (!salesData) return null;

  return (
    <div className="space-y-6">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
          <p className="text-2xl font-black text-slate-900 font-mono">
            ${salesData.summary?.total_revenue?.toFixed(2) ?? '0.00'}
          </p>
          <p className="text-[10px] text-slate-500">Gross sales volume</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estimated COGS</span>
          <p className="text-2xl font-black text-slate-700 font-mono">
            ${salesData.summary?.cogs?.toFixed(2) ?? '0.00'}
          </p>
          <p className="text-[10px] text-slate-500">60% cost of goods sold</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Profit</span>
          <p className="text-2xl font-black text-emerald-600 font-mono">
            ${salesData.summary?.gross_profit?.toFixed(2) ?? '0.00'}
          </p>
          <p className="text-[10px] text-emerald-600 font-bold">Net profit generated</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Profit Margin</span>
          <p className="text-2xl font-black text-orange-600 font-mono">
            {salesData.summary?.gross_margin_pct ?? 0}%
          </p>
          <p className="text-[10px] text-slate-500">Average net margin %</p>
        </div>
      </div>

      {/* Top Selling Products Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Top 10 Selling Products</h3>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Product Name</th>
              <th className="py-2.5 px-3 text-center">Units Sold</th>
              <th className="py-2.5 px-3 text-right">Revenue Generated ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(salesData.top_products || []).map((tp: any, idx: number) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3 font-bold text-slate-900">{tp.product_name}</td>
                <td className="py-2.5 px-3 text-center font-bold text-slate-700">{Number(tp.total_quantity)}</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-orange-600">
                  ${Number(tp.total_revenue).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
