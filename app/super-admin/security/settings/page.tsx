'use client';

import React, { useState } from 'react';
import { Store, Save, CheckCircle2 } from 'lucide-react';

export default function AdminStoreSettingsPage() {
  const [storeName, setStoreName] = useState('Dreams Coffee & Bakery');
  const [vatTaxRate, setVatTaxRate] = useState('10');
  const [currencyMode, setCurrencyMode] = useState('USD_KHR');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto font-sans text-slate-800">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Store className="w-7 h-7 text-blue-600" />
          Store & System Configuration Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">Configure global store details, VAT tax rates, currency modes, and receipt branding</p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> System settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs space-y-6">
        <div className="space-y-4 text-xs">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-slate-400">General Store Info</h2>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Company / Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Default VAT Tax Rate (%)</label>
              <input
                type="number"
                value={vatTaxRate}
                onChange={(e) => setVatTaxRate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Operating Currency Mode</label>
              <select
                value={currencyMode}
                onChange={(e) => setCurrencyMode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900"
              >
                <option value="USD_KHR">Dual Currency ($ USD & ៛ KHR NBC Exchange)</option>
                <option value="USD">Single Currency ($ USD)</option>
                <option value="KHR">Single Currency (៛ KHR)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
}
