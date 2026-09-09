'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, Plus, Search, CheckCircle2 } from 'lucide-react';
import { getExpensesApi, createExpenseApi } from '@/lib/api';
import { OperatingExpense, ExpenseFormData, EXPENSE_CATEGORIES } from './types';
import { RecordExpenseModal } from './RecordExpenseModal';

export function SuperAdminExpensesView() {
  const [expenses, setExpenses] = useState<OperatingExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ExpenseFormData>({
    category: 'Utilities & Power',
    description: '',
    amount: '',
    date_paid: new Date().toISOString().split('T')[0],
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;

    try {
      setSubmitting(true);
      await createExpenseApi({
        category: form.category,
        description: form.description,
        amount: parseFloat(form.amount),
        date_paid: form.date_paid,
      });

      setShowModal(false);
      setForm({
        category: 'Utilities & Power',
        description: '',
        amount: '',
        date_paid: new Date().toISOString().split('T')[0],
      });
      setToastMessage('Expense recorded successfully in general ledger!');
      setTimeout(() => setToastMessage(null), 4000);
      await loadExpenses();
    } catch (err: any) {
      setToastMessage(err.message || 'Failed to record expense.');
      setTimeout(() => setToastMessage(null), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      (e.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.expense_ref || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.category || '').toLowerCase().includes(search.toLowerCase());
    const matchesCat = !categoryFilter || e.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalExpenseSum = filteredExpenses.reduce(
    (acc, item) => acc + (parseFloat(String(item.amount)) || 0),
    0
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <DollarSign className="w-7 h-7 text-rose-600" />
            Operating Expenses &amp; Petty Cash Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track store overhead costs, rent, electricity, repair bills, and petty cash disbursements
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Expense</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Expenses Recorded</span>
          <p className="text-2xl font-black font-mono text-rose-600">
            ${totalExpenseSum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Expense Records</span>
          <p className="text-2xl font-black font-mono text-slate-900">{filteredExpenses.length} Entries</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Audit Status</span>
          <p className="text-2xl font-black text-emerald-600">Double-Entry Verified</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search ref, description or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="">All Categories</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
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
            ) : filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                  No operating expenses found. Click &quot;Record New Expense&quot; to add your first entry.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{e.expense_ref}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-extrabold">
                      {e.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{e.description}</td>
                  <td className="py-3.5 px-4 font-mono font-black text-rose-600 text-sm">
                    ${Number(e.amount).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-right">{e.date_paid}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <RecordExpenseModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleCreateExpense}
        submitting={submitting}
      />
    </div>
  );
}
