'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, RefreshCw } from 'lucide-react';
import { getExpensesApi } from '@/lib/api';

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const res = await getExpensesApi();
      setExpenses(res.data || []);
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <DollarSign className="w-7 h-7 text-rose-600" />
            Operating Expenses & Petty Cash Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">Track store overhead costs, rent, electricity, repair bills, and petty cash disbursements</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Expense Ref</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Amount ($)</th>
              <th className="py-3 px-4 text-right">Date Paid</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-1 text-rose-600" />
                  Loading operating expenses...
                </td>
              </tr>
            ) : expenses.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{e.expense_ref}</td>
                <td className="py-3.5 px-4 font-bold text-slate-800">{e.category}</td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">{e.description}</td>
                <td className="py-3.5 px-4 font-mono font-black text-rose-600 text-sm">${Number(e.amount).toFixed(2)}</td>
                <td className="py-3.5 px-4 font-mono text-slate-500 text-right">{e.date_paid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
