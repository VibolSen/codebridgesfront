'use client';

import React, { useState, useEffect } from 'react';
import { Building2, RefreshCw } from 'lucide-react';
import { getBankAccountsApi } from '@/lib/api';

export default function AdminBankAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-blue-600" />
            Bank Accounts & Settlement Providers
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage merchant bank accounts, NBC Bakong Open API credentials, and settlement payout destinations</p>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-400 text-xs font-semibold bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
          Loading bank accounts & settlement destinations...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {accounts.map((acc) => (
            <div key={acc.id} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900">{acc.bank_name}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                  {acc.status}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-semibold">{acc.account_name}</p>
                <p className="text-base font-mono font-black text-slate-900">{acc.account_number}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Currency:</span>
                <span className="font-bold text-blue-600">{acc.currency}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
