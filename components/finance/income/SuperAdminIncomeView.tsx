'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, Plus, Search, CheckCircle2 } from 'lucide-react';
import { getIncomesApi, createIncomeApi } from '@/lib/api';
import { IncomeRecord, IncomeFormData, INCOME_SOURCES } from './types';
import { RecordIncomeModal } from './RecordIncomeModal';

export function SuperAdminIncomeView() {
  const [incomes, setIncomes] = useState<IncomeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<IncomeFormData>({
    source: 'Catering & Preorders',
    description: '',
    amount: '',
    date_received: new Date().toISOString().split('T')[0],
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const handleCreateIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;

    try {
      setSubmitting(true);
      await createIncomeApi({
        source: form.source,
        description: form.description,
        amount: parseFloat(form.amount),
        date_received: form.date_received,
      });

      setShowModal(false);
      setForm({
        source: 'Catering & Preorders',
        description: '',
        amount: '',
        date_received: new Date().toISOString().split('T')[0],
      });
      setToastMessage('Miscellaneous income recorded successfully!');
      setTimeout(() => setToastMessage(null), 4000);
      await loadIncomes();
    } catch (err: any) {
      setToastMessage(err.message || 'Failed to record income.');
      setTimeout(() => setToastMessage(null), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredIncomes = incomes.filter((inc) => {
    const matchesSearch =
      (inc.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (inc.income_ref || '').toLowerCase().includes(search.toLowerCase()) ||
      (inc.source || '').toLowerCase().includes(search.toLowerCase());
    const matchesSource = !sourceFilter || inc.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const totalIncomeSum = filteredIncomes.reduce(
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
            <TrendingUp className="w-7 h-7 text-emerald-600" />
            Miscellaneous Store Income &amp; Non-POS Revenue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Record non-register revenue streams, catering prepayments, and ancillary income
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record Miscellaneous Income</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Income Recorded</span>
          <p className="text-2xl font-black font-mono text-emerald-600">
            ${totalIncomeSum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Income Transactions</span>
          <p className="text-2xl font-black font-mono text-slate-900">{filteredIncomes.length} Entries</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Settlement Channel</span>
          <p className="text-2xl font-black text-blue-600">Merchant Float</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search ref, description or source..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="">All Income Sources</option>
            {INCOME_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Incomes Table */}
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
            ) : filteredIncomes.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                  No miscellaneous income records found. Click &quot;Record Miscellaneous Income&quot; to add your first entry.
                </td>
              </tr>
            ) : (
              filteredIncomes.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{inc.income_ref}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-extrabold">
                      {inc.source}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{inc.description}</td>
                  <td className="py-3.5 px-4 font-mono font-black text-emerald-600 text-sm">
                    ${Number(inc.amount).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-right">{inc.date_received}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <RecordIncomeModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleCreateIncome}
        submitting={submitting}
      />
    </div>
  );
}
