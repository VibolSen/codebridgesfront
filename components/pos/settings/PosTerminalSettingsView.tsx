'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Sliders,
  ShieldCheck,
  Save,
  RotateCcw,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { getOutletsApi, getAuthUser } from '@/lib/api';
import { PosHardwareSettingsTab } from './PosHardwareSettingsTab';
import { PosPolicySettingsTab } from './PosPolicySettingsTab';

const DEFAULT_SETTINGS = {
  terminalName: 'Register 01 - Main Counter',
  terminalId: 'POS-TERM-001',
  outletId: '',
  outletName: 'Amazon Cafe (BKK1)',
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

function PosTerminalSettingsContent() {
  const [activeTab, setActiveTab] = useState<'hardware' | 'policies'>('hardware');
  const [outlets, setOutlets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testPrintSuccess, setTestPrintSuccess] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cb_pos_terminal_settings');
      if (saved) {
        try {
          setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }));
        } catch {}
      }
    }

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

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cb_pos_terminal_settings', JSON.stringify(settings));
      window.dispatchEvent(new CustomEvent('cb_terminal_settings_updated', { detail: settings }));
    }
    setTimeout(() => {
      setLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 400);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all terminal hardware & currency settings to factory defaults?')) {
      const reset = { ...DEFAULT_SETTINGS, outletId: outlets[0]?.id || '' };
      setSettings(reset);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cb_pos_terminal_settings', JSON.stringify(reset));
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B4DFB] mb-1">
            <Settings className="w-4 h-4" />
            <span>POS Hardware &amp; Peripheral Configuration</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Terminal Settings</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-[#5B4DFB] hover:bg-[#4a3cf0] text-white font-black text-xs shadow-md shadow-[#5B4DFB]/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{loading ? 'Saving Changes...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Terminal hardware &amp; currency policies successfully updated!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs Switcher */}
      <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold max-w-sm">
        <button
          type="button"
          onClick={() => setActiveTab('hardware')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'hardware' ? 'bg-white text-[#5B4DFB] shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Hardware &amp; Peripherals</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('policies')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'policies' ? 'bg-white text-[#5B4DFB] shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Currency &amp; Security</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'hardware' ? (
        <PosHardwareSettingsTab
          settings={settings}
          onChange={handleChange}
          onTestPrint={() => {
            setTestPrintSuccess(true);
            setTimeout(() => setTestPrintSuccess(false), 3000);
          }}
          testPrintSuccess={testPrintSuccess}
        />
      ) : (
        <PosPolicySettingsTab
          settings={settings}
          outlets={outlets}
          onChange={handleChange}
        />
      )}
    </div>
  );
}

export function PosTerminalSettingsView() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-[#5B4DFB]" />
            <span>Loading Terminal Settings...</span>
          </div>
        </div>
      }
    >
      <PosTerminalSettingsContent />
    </Suspense>
  );
}
