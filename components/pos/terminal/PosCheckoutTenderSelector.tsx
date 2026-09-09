'use client';

import React from 'react';
import { Banknote, QrCode, CreditCard } from 'lucide-react';

interface PosCheckoutTenderSelectorProps {
  tenderType: 'cash' | 'khqr' | 'card';
  onSelectTender: (type: 'cash' | 'khqr' | 'card') => void;
}

export function PosCheckoutTenderSelector({
  tenderType,
  onSelectTender,
}: PosCheckoutTenderSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        type="button"
        onClick={() => onSelectTender('cash')}
        className={`p-2.5 rounded-xl border text-xs font-black flex flex-col items-center gap-1 transition-all cursor-pointer ${
          tenderType === 'cash'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
        }`}
      >
        <Banknote className="w-4 h-4 text-emerald-600" />
        <span>Cash</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTender('khqr')}
        className={`p-2.5 rounded-xl border text-xs font-black flex flex-col items-center gap-1 transition-all cursor-pointer ${
          tenderType === 'khqr'
            ? 'bg-orange-50 text-orange-800 border-orange-300 shadow-xs'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
        }`}
      >
        <QrCode className="w-4 h-4 text-orange-600" />
        <span>ABA KHQR</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTender('card')}
        className={`p-2.5 rounded-xl border text-xs font-black flex flex-col items-center gap-1 transition-all cursor-pointer ${
          tenderType === 'card'
            ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-xs'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
        }`}
      >
        <CreditCard className="w-4 h-4 text-blue-600" />
        <span>Card</span>
      </button>
    </div>
  );
}
