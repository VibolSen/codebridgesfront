'use client';

import React, { useState, useEffect } from 'react';
import { Building2, RefreshCw, Plus, X, CheckCircle2, Loader2, Wallet, Landmark } from 'lucide-react';
import { getBankAccountsApi, createBankAccountApi } from '@/lib/api';

export default function AdminBankAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    bank_name: 'ABA Bank',
    account_name: '',
    account_number: '',
    currency: 'USD',
    status: 'connected',
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadBankAccounts();
  }, []);

  const loadBankAccounts = async () => {
    try {
      setLoading(true);
      const res = await getBankAccountsApi();
      setAccounts(res.data || []);
    } catch (err) {
      console.error('Failed to load bank accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.account_name || !form.account_number) return;

    try {
      setSubmitting(true);
      await createBankAccountApi(form);

      setShowModal(false);
      setForm({
        bank_name: 'ABA Bank',
        account_name: '',
        account_number: '',
        currency: 'USD',
        status: 'connected',
      });
      setToastMessage('Bank account connected successfully!');
      setTimeout(() => setToastMessage(null), 4000);
      await loadBankAccounts();
    } catch (err: any) {
      setToastMessage(err.message || 'Failed to connect bank account.');
      setTimeout(() => setToastMessage(null), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const supportedBanks = [
    'ABA Bank (PayWay & KHQR)',
    'NBC Bakong Open API Engine',
    'ACLEDA Bank Plc',
    'Canadia Bank',
    'Sathapana Bank',
    'Wing Bank',
    'Other Commercial Bank',
  ];

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
            <Building2 className="w-7 h-7 text-blue-600" />
            Bank Accounts &amp; Settlement Providers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage merchant bank accounts, NBC Bakong Open API credentials, and settlement payout destinations
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Connect Bank Account</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-400 text-xs font-semibold bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
          Loading bank accounts &amp; settlement destinations...
        </div>
      ) : accounts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <Landmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-extrabold text-slate-900">No Bank Accounts Connected</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Connect your merchant bank accounts or NBC Bakong KHQR credentials to enable automated payment reconciliation and payout tracking.
          </p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Connect First Bank Account</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {accounts.map((acc) => (
            <div key={acc.id} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900">{acc.bank_name}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                  {acc.status || 'connected'}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-semibold">{acc.account_name}</p>
                <p className="text-base font-mono font-black text-slate-900">{acc.account_number}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Settlement Currency:</span>
                <span className="font-bold text-blue-600">{acc.currency || 'USD'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Connect Account Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>Connect Bank Account</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Financial Institution *</label>
                <select
                  value={form.bank_name}
                  onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800"
                >
                  {supportedBanks.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Account Holder Name *</label>
                <input
                  type="text"
                  required
                  value={form.account_name}
                  onChange={(e) => setForm({ ...form, account_name: e.target.value })}
                  placeholder="e.g. My Business POS Outlet 01"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Account Number / Bakong ID *</label>
                <input
                  type="text"
                  required
                  value={form.account_number}
                  onChange={(e) => setForm({ ...form, account_number: e.target.value })}
                  placeholder="e.g. 000 123 456 or merchant@acleda"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Currency</label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="KHR">KHR (៛)</option>
                    <option value="USD / KHR">Dual (USD / KHR)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Integration Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800"
                  >
                    <option value="connected">Connected &amp; Active</option>
                    <option value="pending">Pending API Verification</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Bank Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
