'use client';

import React, { useState, useEffect } from 'react';
import { Building2, RefreshCw, Plus, CheckCircle2, Landmark } from 'lucide-react';
import { getBankAccountsApi, createBankAccountApi } from '@/lib/api';
import { BankAccount, BankAccountFormData } from './types';
import { ConnectBankAccountModal } from './ConnectBankAccountModal';

export function SuperAdminBankAccountsView() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<BankAccountFormData>({
    bank_name: 'ABA Bank (PayWay & KHQR)',
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
        bank_name: 'ABA Bank (PayWay & KHQR)',
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
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
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

      <ConnectBankAccountModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleCreateAccount}
        submitting={submitting}
      />
    </div>
  );
}
