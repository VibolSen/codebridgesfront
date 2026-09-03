'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Banknote,
  X,
  Check,
  RotateCcw,
  Sparkles,
  Calculator,
  ArrowRight,
} from 'lucide-react';

interface DenominationCounts {
  usd: Record<number, number>;
  khr: Record<number, number>;
}

const USD_DENOMS = [100, 50, 20, 10, 5, 1];
const KHR_DENOMS = [50000, 20000, 10000, 5000, 1000, 500, 100];
const KHR_RATE = 4100;

interface DualCurrencyDenominationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (totalUsd: number, summary: { usdTotal: number; khrTotal: number; blendedUsd: number }) => void;
  title?: string;
}

export function DualCurrencyDenominationModal({
  isOpen,
  onClose,
  onApply,
  title = 'Physical Cash Denomination Counter',
}: DualCurrencyDenominationModalProps) {
  const [activeCurrency, setActiveCurrency] = useState<'USD' | 'KHR'>('USD');
  const [usdCounts, setUsdCounts] = useState<Record<number, number>>({
    100: 0,
    50: 0,
    20: 0,
    10: 0,
    5: 0,
    1: 0,
  });
  const [khrCounts, setKhrCounts] = useState<Record<number, number>>({
    50000: 0,
    20000: 0,
    10000: 0,
    5000: 0,
    1000: 0,
    500: 0,
    100: 0,
  });

  const handleUpdateCount = (denom: number, count: number, currency: 'USD' | 'KHR') => {
    const val = Math.max(0, count);
    if (currency === 'USD') {
      setUsdCounts((prev) => ({ ...prev, [denom]: val }));
    } else {
      setKhrCounts((prev) => ({ ...prev, [denom]: val }));
    }
  };

  const handleReset = () => {
    setUsdCounts({ 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 1: 0 });
    setKhrCounts({ 50000: 0, 20000: 0, 10000: 0, 5000: 0, 1000: 0, 500: 0, 100: 0 });
  };

  const totalUsd = Object.entries(usdCounts).reduce(
    (acc, [denom, count]) => acc + Number(denom) * count,
    0
  );

  const totalKhr = Object.entries(khrCounts).reduce(
    (acc, [denom, count]) => acc + Number(denom) * count,
    0
  );

  const khrConvertedToUsd = totalKhr / KHR_RATE;
  const blendedUsdTotal = totalUsd + khrConvertedToUsd;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-black">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">{title}</h2>
              <p className="text-[11px] text-orange-100 font-medium">
                Dual-currency physical bill count (1 USD = {KHR_RATE.toLocaleString()} KHR)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Currency Switcher Tabs */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex bg-slate-200/80 p-1 rounded-2xl text-xs font-black">
            <button
              type="button"
              onClick={() => setActiveCurrency('USD')}
              className={`px-5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCurrency === 'USD'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>USD Bills ($)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCurrency('KHR')}
              className={`px-5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCurrency === 'KHR'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Banknote className="w-3.5 h-3.5" />
              <span>KHR Bills (៛)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Counts</span>
          </button>
        </div>

        {/* Denomination Counter List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {activeCurrency === 'USD' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {USD_DENOMS.map((denom) => {
                const count = usdCounts[denom] || 0;
                const subtotal = denom * count;
                return (
                  <div
                    key={`usd-${denom}`}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-slate-900">${denom}</span>
                      <span className="text-xs font-extrabold text-orange-600">
                        ${subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateCount(denom, count - 1, 'USD')}
                        className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 text-slate-700 font-black border border-slate-200 text-xs flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={count === 0 ? '' : count}
                        placeholder="0"
                        onChange={(e) =>
                          handleUpdateCount(denom, parseInt(e.target.value) || 0, 'USD')
                        }
                        className="flex-1 text-center py-1 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateCount(denom, count + 1, 'USD')}
                        className="w-8 h-8 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 font-black border border-orange-200 text-xs flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {KHR_DENOMS.map((denom) => {
                const count = khrCounts[denom] || 0;
                const subtotal = denom * count;
                return (
                  <div
                    key={`khr-${denom}`}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-slate-900">
                        {denom.toLocaleString()} ៛
                      </span>
                      <span className="text-[11px] font-extrabold text-amber-700">
                        {subtotal.toLocaleString()} ៛
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateCount(denom, count - 1, 'KHR')}
                        className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 text-slate-700 font-black border border-slate-200 text-xs flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={count === 0 ? '' : count}
                        placeholder="0"
                        onChange={(e) =>
                          handleUpdateCount(denom, parseInt(e.target.value) || 0, 'KHR')
                        }
                        className="flex-1 text-center py-1 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateCount(denom, count + 1, 'KHR')}
                        className="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-black border border-amber-200 text-xs flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Summary & Apply */}
        <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400">USD Cash:</span>
              <strong className="text-white font-black">${totalUsd.toFixed(2)}</strong>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">KHR Cash:</span>
              <strong className="text-amber-400 font-black">{totalKhr.toLocaleString()} ៛</strong>
            </div>
            <p className="text-lg font-black text-white">
              Blended Cash Total:{' '}
              <span className="text-emerald-400">${blendedUsdTotal.toFixed(2)}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(blendedUsdTotal, {
                  usdTotal: totalUsd,
                  khrTotal: totalKhr,
                  blendedUsd: blendedUsdTotal,
                });
                onClose();
              }}
              className="px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-black text-xs shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply to Shift (${blendedUsdTotal.toFixed(2)})</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
