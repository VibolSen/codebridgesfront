'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Printer,
  X,
  FileText,
  DollarSign,
  QrCode,
  CreditCard,
  Building2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface PosThermalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: 'X-REPORT' | 'Z-REPORT';
  shift: any;
  user?: any;
}

export function PosThermalReportModal({
  isOpen,
  onClose,
  reportType,
  shift,
  user,
}: PosThermalReportModalProps) {
  if (!isOpen || !shift) return null;

  const handlePrint = () => {
    window.print();
  };

  const isZReport = reportType === 'Z-REPORT';
  const reportTitle = isZReport ? 'END-OF-DAY FISCAL Z-REPORT' : 'MID-SHIFT AUDIT X-REPORT';
  const reportCode = isZReport ? `Z-${String(shift.id || 1).padStart(4, '0')}` : `X-${String(shift.id || 1).padStart(4, '0')}`;

  const openingFloat = Number(shift.opening_float || 100);
  const cashSales = Number(shift.cash_sales || 342.50);
  const khqrSales = Number(shift.khqr_sales || 188.00);
  const cardSales = Number(shift.card_sales || 64.50);
  const payIns = Number(shift.pay_ins || 0);
  const payOuts = Number(shift.pay_outs || 15.00);
  const safeDrops = Number(shift.safe_drops || 200.00);

  const grossSales = cashSales + khqrSales + cardSales;
  const taxCollected = grossSales * 0.10;
  const netSales = grossSales - taxCollected;
  const expectedCash = openingFloat + cashSales + payIns - payOuts - safeDrops;
  const countedCash = Number(shift.counted_cash || expectedCash);
  const variance = countedCash - expectedCash;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" />
            <div>
              <h2 className="text-sm font-black tracking-tight">{reportTitle}</h2>
              <p className="text-[10px] text-slate-400 font-mono">Sequence #{reportCode}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Thermal Receipt Paper Container */}
        <div className="p-6 overflow-y-auto bg-slate-100 flex-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-md font-mono text-[11px] text-slate-800 space-y-4 max-w-[340px] mx-auto select-all">
            {/* Store Header */}
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
              <p className="font-black text-sm text-slate-900 tracking-wider">CODEBRIDGES POS</p>
              <p className="text-[10px] text-slate-500">BKK1 Flagship Outlet #1</p>
              <p className="text-[10px] text-slate-500">Phnom Penh, Cambodia</p>
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1">
                *** {reportTitle} ***
              </p>
            </div>

            {/* Shift & Time Details */}
            <div className="space-y-1 text-[10px] text-slate-600 pb-3 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span>Report ID:</span>
                <strong className="text-slate-900">{reportCode}</strong>
              </div>
              <div className="flex justify-between">
                <span>Register:</span>
                <strong className="text-slate-900">Terminal #01 (Main Bar)</strong>
              </div>
              <div className="flex justify-between">
                <span>Cashier:</span>
                <strong className="text-slate-900">{shift.cashier_name || user?.name || 'Sokha Meng'}</strong>
              </div>
              <div className="flex justify-between">
                <span>Opened At:</span>
                <span>{shift.opened_at ? shift.opened_at.slice(0, 16) : '2026-08-28 07:30'}</span>
              </div>
              <div className="flex justify-between">
                <span>Report Time:</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>

            {/* Sales Tender Breakdown */}
            <div className="space-y-1.5 pb-3 border-b border-dashed border-slate-300">
              <p className="font-black text-[10px] text-slate-900 uppercase">Tender Summary</p>
              <div className="flex justify-between">
                <span>Cash Sales (USD):</span>
                <strong className="text-slate-900">${cashSales.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Bakong KHQR (៛):</span>
                <strong className="text-slate-900">${khqrSales.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Credit/Debit Card:</span>
                <strong className="text-slate-900">${cardSales.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>GROSS SALES:</span>
                <span className="text-orange-600">${grossSales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>VAT Tax (10%):</span>
                <span>${taxCollected.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>NET REVENUE:</span>
                <span>${netSales.toFixed(2)}</span>
              </div>
            </div>

            {/* Cash Drawer Reconciliation */}
            <div className="space-y-1.5 pb-3 border-b border-dashed border-slate-300">
              <p className="font-black text-[10px] text-slate-900 uppercase">Drawer Cash Movement</p>
              <div className="flex justify-between">
                <span>+ Opening Float:</span>
                <span>${openingFloat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>+ Cash Tendered:</span>
                <span>${cashSales.toFixed(2)}</span>
              </div>
              {payIns > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>+ Cash Pay-Ins:</span>
                  <span>+${payIns.toFixed(2)}</span>
                </div>
              )}
              {payOuts > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>- Cash Pay-Outs:</span>
                  <span>-${payOuts.toFixed(2)}</span>
                </div>
              )}
              {safeDrops > 0 && (
                <div className="flex justify-between text-indigo-600 font-bold">
                  <span>- Safe Drops:</span>
                  <span>-${safeDrops.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>EXPECTED DRAWER:</span>
                <span>${expectedCash.toFixed(2)}</span>
              </div>
              {isZReport && (
                <>
                  <div className="flex justify-between font-black text-slate-900">
                    <span>COUNTED PHYSICAL CASH:</span>
                    <span>${countedCash.toFixed(2)}</span>
                  </div>
                  <div
                    className={`flex justify-between font-black ${
                      variance === 0
                        ? 'text-emerald-600'
                        : variance > 0
                        ? 'text-blue-600'
                        : 'text-rose-600'
                    }`}
                  >
                    <span>CASH VARIANCE:</span>
                    <span>
                      {variance > 0 ? `+$${variance.toFixed(2)}` : variance < 0 ? `-$${Math.abs(variance).toFixed(2)}` : '$0.00 (Balanced)'}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Dual Currency Cash Total */}
            <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] space-y-0.5">
              <p className="font-bold text-slate-700">KHR Equivalent Total (4,100 ៛/$)</p>
              <p className="font-black text-amber-700 text-xs">
                {(expectedCash * 4100).toLocaleString()} ៛
              </p>
            </div>

            {/* Footer Notice */}
            <div className="text-center text-[9px] text-slate-400 pt-2 space-y-1">
              <p>*** {isZReport ? 'END OF FISCAL Z-SESSION' : 'AUDIT X-READING ONLY'} ***</p>
              <p>CodeBridges Multi-Tenant Cloud Architecture</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
