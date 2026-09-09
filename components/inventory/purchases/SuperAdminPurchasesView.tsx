'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, RefreshCw } from 'lucide-react';
import { getPurchasesApi } from '@/lib/api';

export const SuperAdminPurchasesView: React.FC = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const res = await getPurchasesApi();
      setPurchases(res.data || []);
    } catch (err) {
      console.error('Failed to load purchases:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-blue-600" />
            Supplier Stock Purchases & Invoices
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage vendor stock receiving bills, cost invoices, and inventory replenishment records
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Purchase Ref</th>
              <th className="py-3 px-4">Supplier Name</th>
              <th className="py-3 px-4">Invoice No.</th>
              <th className="py-3 px-4">Total Cost ($)</th>
              <th className="py-3 px-4">Date Received</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-1 text-blue-600" />
                  Loading purchase invoices...
                </td>
              </tr>
            ) : purchases.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.purchase_ref}</td>
                <td className="py-3.5 px-4 font-bold text-slate-800">{p.supplier}</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">{p.invoice_no}</td>
                <td className="py-3.5 px-4 font-mono font-black text-blue-600 text-sm">
                  ${Number(p.total_amount).toFixed(2)}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-500">{p.received_date}</td>
                <td className="py-3.5 px-4 text-right">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
