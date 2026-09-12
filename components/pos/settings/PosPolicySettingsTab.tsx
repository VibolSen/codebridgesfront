'use client';

import React from 'react';
import { DollarSign, Lock, Building2, ShieldCheck } from 'lucide-react';

interface PosPolicySettingsTabProps {
  settings: any;
  outlets: any[];
  onChange: (key: string, value: any) => void;
}

export function PosPolicySettingsTab({
  settings,
  outlets,
  onChange,
}: PosPolicySettingsTabProps) {
  return (
    <div className="space-y-6 font-sans">
      {/* Terminal Identity & Outlet */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Terminal Identity &amp; Physical Location</h3>
            <p className="text-xs text-slate-500">Bind this browser/terminal instance to an active store outlet</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Terminal Display Name</label>
            <input
              type="text"
              value={settings.terminalName}
              onChange={(e) => onChange('terminalName', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Terminal Hardware ID</label>
            <input
              type="text"
              value={settings.terminalId}
              disabled
              className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Store Outlet</label>
            <select
              value={settings.outletId}
              onChange={(e) => {
                const sel = outlets.find((o) => String(o.id) === e.target.value);
                onChange('outletId', e.target.value);
                if (sel) onChange('outletName', sel.name);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            >
              {outlets.length === 0 ? (
                <option value="">Default Branch</option>
              ) : (
                outlets.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.code || 'MAIN'})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Dual Currency & FX Engine */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Dual Currency &amp; FX Exchange Rate Engine</h3>
            <p className="text-xs text-slate-500">Seamless USD / KHR dual cash calculation &amp; change rounding</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Base Currency</label>
            <select
              value={settings.baseCurrency}
              onChange={(e) => onChange('baseCurrency', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            >
              <option value="USD">USD ($ - US Dollar)</option>
              <option value="KHR">KHR (៛ - Khmer Riel)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Exchange Rate (1 USD = X KHR)</label>
            <input
              type="number"
              step="10"
              value={settings.exchangeRate}
              onChange={(e) => onChange('exchangeRate', Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">KHR Cash Change Rounding</label>
            <select
              value={settings.khrRounding}
              onChange={(e) => onChange('khrRounding', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            >
              <option value="100">Round to 100 Riels (Common)</option>
              <option value="500">Round to 500 Riels</option>
              <option value="exact">Exact (No Rounding)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security & Policies */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Security &amp; Supervisor Authorization</h3>
            <p className="text-xs text-slate-500">Frontline safeguards and cashier limits</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.requirePinForVoid}
              onChange={(e) => onChange('requirePinForVoid', e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
            />
            <span className="text-xs font-bold text-slate-800">Require Supervisor PIN to Void</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.requirePinForRefund}
              onChange={(e) => onChange('requirePinForRefund', e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
            />
            <span className="text-xs font-bold text-slate-800">Require Supervisor PIN for Returns</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.requirePinForDiscount}
              onChange={(e) => onChange('requirePinForDiscount', e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
            />
            <span className="text-xs font-bold text-slate-800">Require PIN for Custom Discounts</span>
          </label>
        </div>
      </div>
    </div>
  );
}
