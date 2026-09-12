'use client';

import React from 'react';

interface TaxReportTabProps {
  taxData: any;
}

export function TaxReportTab({ taxData }: TaxReportTabProps) {
  if (!taxData) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Taxable Sales (USD)</span>
          <p className="text-3xl font-black text-slate-900 font-mono">
            ${taxData.taxable_sales_usd?.toFixed(2) ?? '0.00'}
          </p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">10% VAT Collected (USD)</span>
          <p className="text-3xl font-black text-brand font-mono">
            ${taxData.vat_collected_usd?.toFixed(2) ?? '0.00'}
          </p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Grand Total (KHR Equivalent)</span>
          <p className="text-3xl font-black text-emerald-600 font-mono">
            ៛{taxData.grand_total_khr?.toLocaleString() ?? '0'}
          </p>
        </div>
      </div>

      <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3 shadow-lg">
        <h3 className="font-bold text-sm text-brand uppercase tracking-wider">Official Tax Settlement Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <p className="text-slate-400">VAT Rate Applied:</p>
            <p className="font-bold text-base">{taxData.vat_rate ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-slate-400">Exchange Rate Benchmark:</p>
            <p className="font-bold text-base">{taxData.exchange_rate ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-slate-400">VAT Payable KHR:</p>
            <p className="font-bold text-base text-brand">
              ៛{taxData.vat_collected_khr?.toLocaleString() ?? '0'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
