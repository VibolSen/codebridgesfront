'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Banknote,
  QrCode,
  CreditCard,
  CheckCircle2,
  X,
  Sparkles,
  DollarSign,
  Printer,
} from 'lucide-react';
import { CartItem } from '../types';

interface PosCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedCoupon: any;
  defaultTender?: 'cash' | 'khqr' | 'card';
  onCompleteSale: (tenderType: 'cash' | 'khqr' | 'card', cashTendered: number, printReceipt?: boolean) => Promise<void>;
  onTriggerKhqrModal: () => void;
}

export function PosCheckoutModal({
  isOpen,
  onClose,
  cart,
  appliedCoupon,
  defaultTender = 'cash',
  onCompleteSale,
  onTriggerKhqrModal,
}: PosCheckoutModalProps) {
  const [tenderType, setTenderType] = useState<'cash' | 'khqr' | 'card'>(defaultTender);
  const [cashTendered, setCashTendered] = useState<string>('');
  const [printReceipt, setPrintReceipt] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? (subtotal * appliedCoupon.value) / 100
      : appliedCoupon.value
    : 0;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = taxableSubtotal * 0.1; // 10% VAT
  const grandTotal = taxableSubtotal + tax;

  useEffect(() => {
    if (isOpen) {
      setTenderType(defaultTender);
      setCashTendered(grandTotal.toFixed(2));
    }
  }, [isOpen, defaultTender, grandTotal]);

  if (!isOpen) return null;

  const tenderedNum = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, tenderedNum - grandTotal);
  const isCashSufficient = tenderType !== 'cash' || tenderedNum >= grandTotal;

  const denominations = [
    grandTotal,
    Math.ceil(grandTotal / 5) * 5,
    Math.ceil(grandTotal / 10) * 10,
    20,
    50,
    100,
  ].filter((v, i, a) => v >= grandTotal && a.indexOf(v) === i).slice(0, 4);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tenderType === 'khqr') {
      onClose();
      onTriggerKhqrModal();
      return;
    }

    try {
      setIsProcessing(true);
      await onCompleteSale(tenderType, tenderedNum, printReceipt);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to complete sale');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden"
      >
        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col max-h-[92vh] overflow-hidden"
        >
          {/* Pinned Header */}
          <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-100 shrink-0 bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-xs shadow-orange-500/20">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">
                  Checkout & Payment Tender
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Select payment method to finalize transaction
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0 space-y-3.5">
            {/* Grand Total Hero Display - Compact & Bold */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-100">
                  Total Amount Due
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-mono">
                  ${grandTotal.toFixed(2)}
                </h2>
              </div>
              <div className="text-right text-[11px] text-orange-100 font-medium">
                <p>{cart.length} item{cart.length === 1 ? '' : 's'}</p>
                <p>Includes 10% VAT</p>
              </div>
            </div>

            {/* Tender Type Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTenderType('cash')}
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
                onClick={() => setTenderType('khqr')}
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
                onClick={() => setTenderType('card')}
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

            {/* Cash Tender Details & Change Due Calculator */}
            {tenderType === 'cash' && (
              <div className="space-y-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-700">
                      Cash Tendered ($)
                    </label>
                    <span className="text-[10px] text-slate-400">Exact: ${grandTotal.toFixed(2)}</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-base font-black text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Quick Denomination Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                  {denominations.map((denom) => (
                    <button
                      key={denom}
                      type="button"
                      onClick={() => setCashTendered(denom.toFixed(2))}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-orange-400 text-[11px] font-black text-slate-700 font-mono shadow-2xs cursor-pointer shrink-0"
                    >
                      ${denom.toFixed(2)}
                    </button>
                  ))}
                </div>

                {/* Change Calculation Box */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">Change Due to Customer:</span>
                  <span className="text-base font-black text-emerald-600 font-mono">
                    ${changeDue.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {tenderType === 'khqr' && (
              <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-center space-y-1 text-xs text-orange-900">
                <QrCode className="w-6 h-6 text-orange-600 mx-auto" />
                <p className="font-extrabold text-xs">Instant Dynamic KHQR Code</p>
                <p className="text-[11px] text-orange-700">
                  Clicking confirm will launch the high-resolution Bakong KHQR prompt with live webhook payment verification.
                </p>
              </div>
            )}

            {tenderType === 'card' && (
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-1 text-xs text-blue-900">
                <CreditCard className="w-6 h-6 text-blue-600 mx-auto" />
                <p className="font-extrabold text-xs">Card Terminal Swiped / Inserted</p>
                <p className="text-[11px] text-blue-700">
                  Please complete the transaction on the physical POS credit card reader before finalizing.
                </p>
              </div>
            )}

            {/* Receipt Print Option */}
            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-colors select-none">
              <input
                type="checkbox"
                checked={printReceipt}
                onChange={(e) => setPrintReceipt(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 accent-orange-500 cursor-pointer shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 font-bold text-xs text-slate-800">
                  <Printer className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>Print customer receipt</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">
                  {printReceipt
                    ? 'Receipt prepared for 80mm thermal printer'
                    : 'Skip paper receipt and proceed to next order'}
                </p>
              </div>
              <span
                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md shrink-0 ${
                  printReceipt
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {printReceipt ? 'Print' : 'No Print'}
              </span>
            </label>
          </div>

          {/* Pinned Action Buttons Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isProcessing || !isCashSufficient}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Finalizing Sale...'
                  : printReceipt
                  ? 'Finalize & Print'
                  : 'Finalize (No Receipt)'}
              </span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
