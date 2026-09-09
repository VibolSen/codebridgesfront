'use client';

import React, { useState, useEffect } from 'react';
import { Percent, RefreshCw } from 'lucide-react';
import { getDiscountsApi } from '@/lib/api';

export function SuperAdminDiscountsView() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    try {
      setLoading(true);
      const res = await getDiscountsApi();
      setDiscounts(res.data || []);
    } catch (err) {
      console.error('Failed to load discounts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Percent className="w-7 h-7 text-purple-600" />
            Promotions &amp; Special Price Rules
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure automated seasonal discounts, Happy Hour rules, and category price reductions
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Promotion Name</th>
              <th className="py-3 px-4">Discount Rate</th>
              <th className="py-3 px-4">Category Scope</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-1 text-purple-600" />
                  Loading discount rules...
                </td>
              </tr>
            ) : (
              discounts.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{d.name}</td>
                  <td className="py-3.5 px-4 font-black text-purple-600 text-sm">{d.discount_pct}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-semibold">{d.applies_to}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
