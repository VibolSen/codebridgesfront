'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders,
  Key,
  ShieldCheck,
  Building2,
  DollarSign,
  Mail,
  Smartphone,
  Save,
  CheckCircle2,
  Lock,
  Globe,
  Clock,
  QrCode,
  Sparkles,
} from 'lucide-react';

export default function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'integrations' | 'security'>('general');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Platform Form State
  const [platformName, setPlatformName] = useState('CodeBridges Enterprise');
  const [supportEmail, setSupportEmail] = useState('support@codebridges.io');
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [defaultTrialDays, setDefaultTrialDays] = useState('14');
  const [defaultTaxRate, setDefaultTaxRate] = useState('10');

  // Integrations State
  const [bakongMerchantId, setBakongMerchantId] = useState('CODEBRIDGES_MASTER_HQ');
  const [bakongBankName, setBakongBankName] = useState('ABA Bank (National Bank of Cambodia)');
  const [bakongSecret, setBakongSecret] = useState('khqr_live_sec_9948291048201');
  const [smsGatewayProvider, setSmsGatewayProvider] = useState('plasgate');
  const [smsApiKey, setSmsApiKey] = useState('pls_api_8849204918239');

  // Security Policies State
  const [sessionTimeout, setSessionTimeout] = useState('120');
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [allowCashierPinSwitch, setAllowCashierPinSwitch] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Global platform settings and integration keys saved successfully!');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-800"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 p-0.5 shadow-md shadow-orange-500/15 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Sliders className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Global Platform Settings
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[10px] font-extrabold border border-orange-200 uppercase">
                Platform Config
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Master configuration for payment gateways, default trial limits, Bakong KHQR credentials, and security policies.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 w-fit text-xs font-extrabold">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'general'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>General Defaults</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('integrations')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'integrations'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Master Integrations (Bakong &amp; SMS)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Security &amp; PIN Policies</span>
        </button>
      </div>

      {/* 3. Form Content */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        {activeTab === 'general' && (
          <div className="space-y-5">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Platform General Defaults
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Master Support Email
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Default Platform Base Currency
                </label>
                <select
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                >
                  <option value="USD">USD ($) - United States Dollar (Dual-currency KHR active)</option>
                  <option value="KHR">KHR (៛) - Khmer Riel</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Default Free Trial Period (Days)
                </label>
                <input
                  type="number"
                  value={defaultTrialDays}
                  onChange={(e) => setDefaultTrialDays(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Default Sales VAT / Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={defaultTaxRate}
                  onChange={(e) => setDefaultTaxRate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 flex items-start gap-3">
              <QrCode className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-orange-950">
                  National Bank of Cambodia (NBC) Bakong KHQR Master Gateway
                </p>
                <p className="text-[11px] text-orange-800 mt-0.5">
                  Platform-wide master credentials used to sign dynamic KHQR payloads across all merchant registers.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bakong Master Merchant ID
                </label>
                <input
                  type="text"
                  value={bakongMerchantId}
                  onChange={(e) => setBakongMerchantId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Acquiring Settlement Bank
                </label>
                <input
                  type="text"
                  value={bakongBankName}
                  onChange={(e) => setBakongBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bakong EMVCo HMAC Secret Key
                </label>
                <input
                  type="password"
                  value={bakongSecret}
                  onChange={(e) => setBakongSecret(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
            </div>

            <hr className="border-slate-100 my-4" />

            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-slate-500" />
              <span>SMS OTP Gateway (Staff 2FA &amp; Receipts)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  SMS Gateway Provider
                </label>
                <select
                  value={smsGatewayProvider}
                  onChange={(e) => setSmsGatewayProvider(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
                >
                  <option value="plasgate">Plasgate (Cambodia Direct Route)</option>
                  <option value="twilio">Twilio Global SMS</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Master SMS API Token
                </label>
                <input
                  type="password"
                  value={smsApiKey}
                  onChange={(e) => setSmsApiKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-5">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Security &amp; Register Terminal Policies
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Mandatory 2FA for Platform Admins
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Require authenticator app (TOTP) for all Super Admin Console logins.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enforce2FA}
                  onChange={(e) => setEnforce2FA(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-slate-300"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Fast Cashier 4-Digit PIN Quick-Switch
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Allow frontline cashiers to switch active accounts on the POS register using 4-digit PINs.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={allowCashierPinSwitch}
                  onChange={(e) => setAllowCashierPinSwitch(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Super Admin Idle Session Timeout (Minutes)
                </label>
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full max-w-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
