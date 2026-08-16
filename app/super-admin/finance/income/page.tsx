'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { getIncomesApi } from '@/lib/api';

export default function AdminIncomePage() {
  const [incomes, setIncomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIncomes();
  }, []);

  const loadIncomes = async () => {
    try {
      setLoading(true);
      const res = await getIncomesApi();
      setIncomes(res.data || []);
    } catch (err) {
      console.error('Failed to load income records:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-emerald-600" />
            Miscellaneous Store Income & Non-POS Revenue
          </h1>
          <p className="text-xs text-slate-500 mt-1">Record non-register revenue streams, catering prepayments, and ancillary income</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Income Ref</th>
              <th className="py-3 px-4">Income Source</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Amount ($)</th>
              <th className="py-3 px-4 text-right">Date Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-1 text-emerald-600" />
                  Loading miscellaneous income records...
                </td>
              </tr>
            ) : incomes.map((inc) => (
              <tr key={inc.id} className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{inc.income_ref}</td>
                <td className="py-3.5 px-4 font-bold text-slate-800">{inc.source}</td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">{inc.description}</td>
                <td className="py-3.5 px-4 font-mono font-black text-emerald-600 text-sm">${Number(inc.amount).toFixed(2)}</td>
                <td className="py-3.5 px-4 font-mono text-slate-500 text-right">{inc.date_received}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
