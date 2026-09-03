'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Split,
  X,
  Users,
  DollarSign,
  QrCode,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertTriangle,
  Receipt,
} from 'lucide-react';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
}

interface SplitBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  grandTotal: number;
  onCompleteSplitPayment: (splitDetails: any) => void;
}

export function SplitBillModal({
  isOpen,
  onClose,
  cartItems,
  grandTotal,
  onCompleteSplitPayment,
}: SplitBillModalProps) {
  const [splitMode, setSplitMode] = useState<'EQUAL' | 'TENDER' | 'CUSTOM'>('TENDER');
  const [numGuests, setNumGuests] = useState<number>(2);

  // Split Tender State (e.g. Cash + KHQR + Card)
  const [cashAmount, setCashAmount] = useState<string>((grandTotal / 2).toFixed(2));
  const [khqrAmount, setKhqrAmount] = useState<string>((grandTotal / 2).toFixed(2));
  const [cardAmount, setCardAmount] = useState<string>('0.00');

  if (!isOpen) return null;

  const equalPerPerson = grandTotal / Math.max(1, numGuests);

  const parsedCash = parseFloat(cashAmount) || 0;
  const parsedKhqr = parseFloat(khqrAmount) || 0;
  const parsedCard = parseFloat(cardAmount) || 0;
  const totalAllocated = parsedCash + parsedKhqr + parsedCard;
  const remainingDue = grandTotal - totalAllocated;
  const isBalanced = Math.abs(remainingDue) < 0.01;

  const handleFinishSplit = () => {
    onCompleteSplitPayment({
      mode: splitMode,
      grandTotal,
      allocations: {
        cash: parsedCash,
        khqr: parsedKhqr,
        card: parsedCard,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-black">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">Split Bill &amp; Multi-Tender</h2>
              <p className="text-[11px] text-orange-100 font-medium">
                Total Check: ${grandTotal.toFixed(2)} ({(grandTotal * 4100).toLocaleString()} KHR)
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

        {/* Mode Tabs */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex bg-slate-200/80 p-1 rounded-2xl text-xs font-black w-full">
            <button
              type="button"
              onClick={() => setSplitMode('TENDER')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer text-center ${
                splitMode === 'TENDER'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Split Tender (Cash + KHQR)
            </button>
            <button
              type="button"
              onClick={() => setSplitMode('EQUAL')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer text-center ${
                splitMode === 'EQUAL'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Split Evenly (Guests)
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {splitMode === 'TENDER' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-medium">
                Allocate payment amounts across Cash, NBC Bakong KHQR, and Card tenders:
              </p>

              {/* Cash Input */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs text-slate-900">Cash Tender (USD $)</p>
                    <p className="text-[10px] text-slate-400">Physical drawer cash</p>
                  </div>
                </div>
                <div className="relative w-36">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    step="0.01"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-black text-right text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Bakong KHQR Input */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs text-slate-900">NBC Bakong KHQR</p>
                    <p className="text-[10px] text-slate-400">Dynamic QR scan-to-pay</p>
                  </div>
                </div>
                <div className="relative w-36">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    step="0.01"
                    value={khqrAmount}
                    onChange={(e) => setKhqrAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-black text-right text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Card / POS Terminal Input */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs text-slate-900">Credit / Debit Card</p>
                    <p className="text-[10px] text-slate-400">Visa / Mastercard / UnionPay</p>
                  </div>
                </div>
                <div className="relative w-36">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    step="0.01"
                    value={cardAmount}
                    onChange={(e) => setCardAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-black text-right text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Allocation Balance Status */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-black ${
                  isBalanced
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
              >
                <span>Allocated: ${totalAllocated.toFixed(2)} / ${grandTotal.toFixed(2)}</span>
                <span>
                  {isBalanced
                    ? '✓ 100% Balanced'
                    : remainingDue > 0
                    ? `Remaining Due: $${remainingDue.toFixed(2)}`
                    : `Over-Allocated: +$${Math.abs(remainingDue).toFixed(2)}`}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-medium">
                Divide the total check equally across dining guests:
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>Number of Guests:</span>
                </span>
                <div className="flex items-center gap-2">
                  {[2, 3, 4, 5, 6].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setNumGuests(n)}
                      className={`w-9 h-9 rounded-xl font-black text-xs transition-all cursor-pointer ${
                        numGuests === n
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-orange-50/70 border border-orange-200 text-center space-y-1">
                <p className="text-xs font-bold text-orange-800 uppercase tracking-wider">
                  Amount Due Per Guest ({numGuests} Persons)
                </p>
                <p className="text-3xl font-black text-orange-600 font-mono">
                  ${equalPerPerson.toFixed(2)}
                </p>
                <p className="text-[11px] text-orange-700 font-medium">
                  Equivalent: {(equalPerPerson * 4100).toLocaleString()} ៛ each
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isBalanced && splitMode === 'TENDER'}
            onClick={handleFinishSplit}
            className="px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-black text-xs shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Process Split Checkout</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
