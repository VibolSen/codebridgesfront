'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  Banknote,
  Check,
  RotateCcw,
} from 'lucide-react';
import { Modal, Button, Badge } from '@/components/ui';

const USD_DENOMS = [100, 50, 20, 10, 5, 1];
const KHR_DENOMS = [50000, 20000, 10000, 5000, 1000, 500, 100];
const DEFAULT_KHR_RATE = 4100;

interface DualCurrencyDenominationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (totalUsd: number, summary: { usdTotal: number; khrTotal: number; blendedUsd: number }) => void;
  title?: string;
  exchangeRate?: number;
}

export function DualCurrencyDenominationModal({
  isOpen,
  onClose,
  onApply,
  title = 'Physical Cash Denomination Counter',
  exchangeRate = DEFAULT_KHR_RATE,
}: DualCurrencyDenominationModalProps) {
  const [activeCurrency, setActiveCurrency] = useState<'USD' | 'KHR'>('USD');
  const [usdCounts, setUsdCounts] = useState<Record<number, number>>({
    100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 1: 0,
  });
  const [khrCounts, setKhrCounts] = useState<Record<number, number>>({
    50000: 0, 20000: 0, 10000: 0, 5000: 0, 1000: 0, 500: 0, 100: 0,
  });

  if (!isOpen) return null;

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

  const totalUsd = Object.entries(usdCounts).reduce((acc, [d, c]) => acc + Number(d) * c, 0);
  const totalKhr = Object.entries(khrCounts).reduce((acc, [d, c]) => acc + Number(d) * c, 0);
  const khrConvertedToUsd = totalKhr / exchangeRate;
  const blendedUsdTotal = totalUsd + khrConvertedToUsd;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={`Dual-currency physical bill count (1 USD = ${exchangeRate.toLocaleString()} KHR)`}
      maxWidth="xl"
      footer={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div className="space-y-0.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">USD Cash:</span>
              <strong className="text-slate-900 font-bold">${totalUsd.toFixed(2)}</strong>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-medium">KHR Cash:</span>
              <strong className="text-amber-700 font-bold">{totalKhr.toLocaleString()} ៛</strong>
            </div>
            <p className="text-sm font-black text-slate-900">
              Blended Cash Total: <span className="text-[#5B4DFB]">${blendedUsdTotal.toFixed(2)}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="brand"
              size="sm"
              iconLeft={<Check className="w-4 h-4" />}
              onClick={() => {
                onApply(blendedUsdTotal, {
                  usdTotal: totalUsd,
                  khrTotal: totalKhr,
                  blendedUsd: blendedUsdTotal,
                });
                onClose();
              }}
            >
              Apply (${blendedUsdTotal.toFixed(2)})
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 font-sans">
        {/* Currency Switcher Toolbar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex p-1 rounded-xl bg-slate-100 gap-1">
            <Button
              variant={activeCurrency === 'USD' ? 'brand' : 'ghost'}
              size="xs"
              iconLeft={<DollarSign className="w-3.5 h-3.5" />}
              onClick={() => setActiveCurrency('USD')}
            >
              USD Bills ($)
            </Button>
            <Button
              variant={activeCurrency === 'KHR' ? 'brand' : 'ghost'}
              size="xs"
              iconLeft={<Banknote className="w-3.5 h-3.5" />}
              onClick={() => setActiveCurrency('KHR')}
            >
              KHR Bills (៛)
            </Button>
          </div>

          <Button
            variant="ghost"
            size="xs"
            iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={handleReset}
          >
            Reset Counts
          </Button>
        </div>

        {/* Denomination Grid */}
        {activeCurrency === 'USD' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {USD_DENOMS.map((denom) => {
              const count = usdCounts[denom] || 0;
              return (
                <div
                  key={`usd-${denom}`}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-900">${denom}</span>
                    <Badge variant="brand" size="sm">
                      ${(denom * count).toLocaleString()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateCount(denom, count - 1, 'USD')}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 text-slate-700 font-black border border-slate-200 text-xs flex items-center justify-center cursor-pointer active:scale-95"
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
                      className="w-full text-center py-1 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateCount(denom, count + 1, 'USD')}
                      className="w-8 h-8 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5B4DFB] font-black border border-purple-200 text-xs flex items-center justify-center cursor-pointer active:scale-95"
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
              return (
                <div
                  key={`khr-${denom}`}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-900">{denom.toLocaleString()} ៛</span>
                    <Badge variant="warning" size="sm">
                      {(denom * count).toLocaleString()} ៛
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateCount(denom, count - 1, 'KHR')}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 text-slate-700 font-black border border-slate-200 text-xs flex items-center justify-center cursor-pointer active:scale-95"
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
                      className="w-full text-center py-1 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateCount(denom, count + 1, 'KHR')}
                      className="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-black border border-amber-200 text-xs flex items-center justify-center cursor-pointer active:scale-95"
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
    </Modal>
  );
}
