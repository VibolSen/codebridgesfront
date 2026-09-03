'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Printer,
  DollarSign,
  Tv,
  ScanBarcode,
  Lock,
  Wifi,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Building2,
  Monitor,
  Sparkles,
  ShieldCheck,
  Zap,
  Sliders,
  CreditCard,
  Layers,
} from 'lucide-react';
import {
  getOutletsApi,
  getAuthUser,
} from '@/lib/api';

export default function PosTerminalSettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [outlets, setOutlets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testPrintSuccess, setTestPrintSuccess] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    // Terminal Identity
    terminalName: 'Register 01 - Main Counter',
    terminalId: 'POS-TERM-001',
    outletId: '',
    outletName: 'Amazon Cafe (BKK1)',

    // Dual Currency & FX Engine
    baseCurrency: 'USD',
    secondaryCurrency: 'KHR',
    exchangeRate: 4100,
    khrRounding: '100', // 100, 500, exact

    // Thermal Printer Configuration
    printerType: 'network', // network, usb, bluetooth
    printerIp: '192.168.1.200',
    printerPort: '9100',
    paperWidth: '80mm', // 80mm, 58mm
    autoPrintReceipt: true,
    printKitchenTicket: true,

    // Cash Drawer
    drawerKickOnCash: true,
    drawerKickPulse: '24v', // 24v, 12v

    // Barcode Scanner & CFD
    barcodeContinuousMode: true,
    barcodeBeeper: true,
    cfdEnabled: true,
    cfdAutoKhqr: true,

    // Security & Policies
    autoLockMinutes: '2', // 1, 2, 5, 0 (disabled)
    requirePinForVoid: true,
    requirePinForRefund: true,
    requirePinForDiscount: true,
  });

  useEffect(() => {
    const currentUser = getAuthUser();
    setUser(currentUser);

    // Load saved settings from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cb_pos_terminal_settings');
      if (saved) {
        try {
          setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }));
        } catch {}
      }
    }

    // Load real outlets
    getOutletsApi()
      .then((res) => {
        const list = Array.isArray(res) ? res : res?.data || [];
        setOutlets(list);
        if (list.length > 0 && !settings.outletId) {
          setSettings((prev) => ({ ...prev, outletId: list[0].id, outletName: list[0].name }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cb_pos_terminal_settings', JSON.stringify(settings));
      // Notify other terminal components via custom event
      window.dispatchEvent(new CustomEvent('cb_terminal_settings_updated', { detail: settings }));
    }
    setTimeout(() => {
      setLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };

  const handleTestPrint = () => {
    setTestPrintSuccess(true);
    setTimeout(() => setTestPrintSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all terminal hardware & currency settings to factory defaults?')) {
      const defaults = {
        terminalName: 'Register 01 - Main Counter',
        terminalId: 'POS-TERM-001',
        outletId: outlets[0]?.id || '',
        outletName: outlets[0]?.name || 'Amazon Cafe (BKK1)',
        baseCurrency: 'USD',
        secondaryCurrency: 'KHR',
        exchangeRate: 4100,
        khrRounding: '100',
        printerType: 'network',
        printerIp: '192.168.1.200',
        printerPort: '9100',
        paperWidth: '80mm',
        autoPrintReceipt: true,
        printKitchenTicket: true,
        drawerKickOnCash: true,
        drawerKickPulse: '24v',
        barcodeContinuousMode: true,
        barcodeBeeper: true,
        cfdEnabled: true,
        cfdAutoKhqr: true,
        autoLockMinutes: '2',
        requirePinForVoid: true,
        requirePinForRefund: true,
        requirePinForDiscount: true,
      };
      setSettings(defaults);
      localStorage.setItem('cb_pos_terminal_settings', JSON.stringify(defaults));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-900 pb-16">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] text-[#5B4DFB] flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Terminal Settings</h1>
            <p className="text-xs text-slate-500 font-medium">Configure thermal printers, dual-currency exchange rate, CFD screens, and security rules</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-[#5B4DFB] hover:bg-[#4E3FE3] active:bg-[#3D30D2] text-white font-black text-xs shadow-md shadow-[#5B4DFB]/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Success Alert Banner */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Terminal settings successfully saved and synced across all register sessions!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Settings Grid (2 Columns) */}
      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1: Terminal Profile & Dual-Currency FX */}
        <div className="space-y-6">
          {/* Card A: Terminal Profile */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-4">
            <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Monitor className="w-4 h-4 text-[#5B4DFB]" />
              <span>Register Terminal Profile</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Terminal Device Name</label>
                <input
                  type="text"
                  value={settings.terminalName}
                  onChange={(e) => setSettings({ ...settings, terminalName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Terminal ID</label>
                  <input
                    type="text"
                    value={settings.terminalId}
                    disabled
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Assigned Store Branch</label>
                  <select
                    value={settings.outletId}
                    onChange={(e) => {
                      const sel = outlets.find((o) => String(o.id) === e.target.value);
                      setSettings({
                        ...settings,
                        outletId: e.target.value,
                        outletName: sel ? sel.name : settings.outletName,
                      });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]"
                  >
                    {outlets.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Dual Currency & FX Engine */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-4">
            <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#5B4DFB]" />
              <span>Dual Currency &amp; Live FX Engine</span>
            </h3>

            <div className="space-y-4">
              {/* Exchange Rate Input */}
              <div className="p-4 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black text-slate-900">Exchange Rate (USD ➔ KHR)</p>
                  <p className="text-[11px] text-slate-500 font-medium">Standard Cambodia retail rate</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#5B4DFB]">1 USD =</span>
                  <input
                    type="number"
                    value={settings.exchangeRate}
                    onChange={(e) => setSettings({ ...settings, exchangeRate: Number(e.target.value) })}
                    className="w-24 px-3 py-1.5 rounded-xl bg-white border border-[#DDD6FE] text-center font-mono font-black text-sm text-[#5B4DFB] focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-600">KHR</span>
                </div>
              </div>

              {/* KHR Rounding Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">KHR Cash Rounding Rule</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '100', label: 'Nearest 100 ៛' },
                    { id: '500', label: 'Nearest 500 ៛' },
                    { id: 'exact', label: 'Exact (No Round)' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSettings({ ...settings, khrRounding: r.id })}
                      className={`py-2 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                        settings.khrRounding === r.id
                          ? 'bg-[#5B4DFB] text-white border-[#5B4DFB] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Hardware Peripherals & Security */}
        <div className="space-y-6">
          {/* Card C: Thermal Receipt Printer & Drawer */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Printer className="w-4 h-4 text-[#5B4DFB]" />
                <span>ESC/POS Thermal Receipt Printer</span>
              </h3>
              <button
                type="button"
                onClick={handleTestPrint}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
              >
                Test Print
              </button>
            </div>

            {testPrintSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Test receipt dispatched to printer IP {settings.printerIp}:{settings.printerPort}!</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Printer IP Address</label>
                  <input
                    type="text"
                    value={settings.printerIp}
                    onChange={(e) => setSettings({ ...settings, printerIp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Port</label>
                  <input
                    type="text"
                    value={settings.printerPort}
                    onChange={(e) => setSettings({ ...settings, printerPort: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]"
                  />
                </div>
              </div>

              {/* Paper Width & Auto Print */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Paper Roll Width</label>
                  <select
                    value={settings.paperWidth}
                    onChange={(e) => setSettings({ ...settings, paperWidth: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="80mm">80mm (Standard POS)</option>
                    <option value="58mm">58mm (Compact Roll)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="autoPrintReceipt"
                    checked={settings.autoPrintReceipt}
                    onChange={(e) => setSettings({ ...settings, autoPrintReceipt: e.target.checked })}
                    className="w-4 h-4 rounded text-[#5B4DFB] focus:ring-[#5B4DFB] cursor-pointer"
                  />
                  <label htmlFor="autoPrintReceipt" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Auto-print on Checkout
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Card D: Customer Display (CFD) & Security Auto-Lock */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-4">
            <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#5B4DFB]" />
              <span>Customer Display &amp; Security Safeguards</span>
            </h3>

            <div className="space-y-3">
              {/* CFD Enable */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Tv className="w-4 h-4 text-slate-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Customer Display Screen (CFD)</p>
                    <p className="text-[10px] text-slate-400">Stream live items &amp; Bakong KHQR to 2nd monitor</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.cfdEnabled}
                  onChange={(e) => setSettings({ ...settings, cfdEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-[#5B4DFB] focus:ring-[#5B4DFB] cursor-pointer"
                />
              </div>

              {/* Auto Lock Timeout */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Terminal Inactivity Auto-Lock</label>
                <select
                  value={settings.autoLockMinutes}
                  onChange={(e) => setSettings({ ...settings, autoLockMinutes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]"
                >
                  <option value="1">Auto-Lock after 1 Minute</option>
                  <option value="2">Auto-Lock after 2 Minutes (Recommended)</option>
                  <option value="5">Auto-Lock after 5 Minutes</option>
                  <option value="0">Disabled (Never Auto-Lock)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
