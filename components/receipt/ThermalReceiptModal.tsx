'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Printer, X, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ThermalReceiptModalProps {
  receiptData?: {
    sale: any;
    lines: any[];
    outlet: any;
    cashier?: any;
    register?: any;
    payments?: any[];
    is_reprint?: boolean;
    print_count?: number;
    print_badge?: string;
  };
  saleData?: any;
  isOpen?: boolean;
  onClose: () => void;
}

export function ThermalReceiptModal({
  receiptData,
  saleData,
  isOpen = true,
  onClose,
}: ThermalReceiptModalProps) {
  if (!isOpen) return null;

  const data = receiptData || {
    sale: saleData?.sale || saleData,
    lines: saleData?.lines || saleData?.items || [],
    outlet: saleData?.outlet || {
      name: 'CodeBridges Store',
      address: 'Main Commercial Ave, Phnom Penh',
      phone: '+855 23 888 999',
    },
    cashier: saleData?.cashier || { name: 'Cashier Staff' },
    register: saleData?.register || { name: 'Terminal #01' },
    payments: saleData?.payments || [
      {
        tender_type: saleData?.tender_type || saleData?.payment_method || 'cash',
        amount: saleData?.grand_total || saleData?.total_amount || saleData?.total || 0,
      },
    ],
    is_reprint: saleData?.is_reprint || false,
    print_count: saleData?.print_count || 1,
    print_badge: saleData?.print_badge,
  };

  const { sale, lines, outlet, cashier, register, payments, is_reprint, print_count, print_badge } = data;

  const handlePrint = () => {
    window.print();
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const formattedDate = sale?.created_at
    ? new Date(sale.created_at).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : new Date().toLocaleString();

  const primaryPayment = payments && payments.length > 0 ? payments[0] : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      
      {/* Printable CSS Rules for Thermal 80mm Roll */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-thermal-receipt,
          #printable-thermal-receipt * {
            visibility: visible !important;
          }
          #printable-thermal-receipt {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 80mm !important;
            margin: 0 !important;
            padding: 10px !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
      >
        {/* Modal Top Bar (Screen Only) */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-orange-400" />
            <h3 className="font-bold text-xs">Customer Sales Receipt</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Action Header (Screen Only) */}
        <div className="p-4 bg-orange-50 border-b border-orange-100 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-orange-950">Transaction Finalized</p>
              <p className="text-[11px] text-orange-700">Receipt ready for 80mm thermal printing</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Don't Print
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md shadow-orange-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Receipt
            </button>
          </div>
        </div>

        {/* --- THERMAL RECEIPT CONTENT AREA (80mm) --- */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 flex justify-center">
          
          <div
            id="printable-thermal-receipt"
            className="w-[300px] bg-white p-5 border border-slate-200 shadow-sm rounded-xl font-mono text-[11px] leading-tight text-slate-900 select-text"
          >
            
            {/* Original / Reprint Badge */}
            <div className="text-center mb-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  is_reprint || (print_count && print_count > 1)
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {print_badge || (is_reprint ? `*** REPRINT RECEIPT (#${print_count || 2}) ***` : '*** ORIGINAL RECEIPT ***')}
              </span>
            </div>

            {/* Store / Outlet Branding Header */}
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
              <h2 className="font-extrabold text-sm uppercase tracking-tight text-slate-900">
                {outlet?.name || 'Freshmart POS'}
              </h2>
              {outlet?.address && <p className="text-[10px] text-slate-600 leading-snug">{outlet.address}</p>}
              {outlet?.phone && <p className="text-[10px] text-slate-600">Tel: {outlet.phone}</p>}
              {outlet?.receipt_header && (
                <p className="text-[10px] italic text-slate-500 pt-1 border-t border-slate-100 mt-1">
                  {outlet.receipt_header}
                </p>
              )}
            </div>

            {/* Metadata (Receipt No, Date, Cashier, Register) */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-extrabold text-slate-900">{sale?.receipt_number || 'REC-00000'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date/Time:</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cashier:</span>
                <span className="font-bold">{cashier?.name || 'Admin Cashier'}</span>
              </div>
              {register?.name && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Register:</span>
                  <span>{register.name}</span>
                </div>
              )}
            </div>

            {/* Line Items List */}
            <div className="py-3 border-b border-dashed border-slate-300 space-y-2">
              <div className="flex justify-between font-bold text-[10px] text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
                <span>Item</span>
                <span>Total</span>
              </div>

              {lines && lines.length > 0 ? (
                lines.map((line: any, idx: number) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between font-semibold">
                      <span className="truncate max-w-[180px]">{line.product_name}</span>
                      <span>${Number(line.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex justify-between">
                      <span>
                        {line.quantity} x ${Number(line.unit_price || 0).toFixed(2)}
                      </span>
                      {Number(line.discount_amount) > 0 && (
                        <span className="text-rose-600 font-bold">
                          -${Number(line.discount_amount).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-400 text-[10px]">No line items</p>
              )}
            </div>

            {/* Financial Totals */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>${Number(sale?.subtotal || 0).toFixed(2)}</span>
              </div>

              {Number(sale?.discount_total) > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Discount:</span>
                  <span>-${Number(sale.discount_total).toFixed(2)}</span>
                </div>
              )}

              {Number(sale?.tax_total) > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax (VAT):</span>
                  <span>${Number(sale.tax_total).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                <span>GRAND TOTAL:</span>
                <span>${Number(sale?.grand_total || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Tender & Payment Info */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[10px]">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Payment Method:</span>
                <span className="uppercase">{primaryPayment?.tender_type || 'CASH'}</span>
              </div>
              {primaryPayment?.tender_type === 'cash' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tendered:</span>
                    <span>${Number(primaryPayment?.amount || sale?.grand_total || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span className="text-slate-500">Change:</span>
                    <span>
                      $
                      {Math.max(
                        0,
                        Number(primaryPayment?.amount || 0) - Number(sale?.grand_total || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Receipt Footer */}
            <div className="pt-3 text-center space-y-2">
              {outlet?.receipt_footer ? (
                <p className="text-[10px] text-slate-600 italic leading-snug">{outlet.receipt_footer}</p>
              ) : (
                <p className="text-[10px] text-slate-500 italic">Thank you for your visit! Please come again.</p>
              )}

              {/* Pseudo Barcode Representation */}
              <div className="pt-2 flex flex-col items-center justify-center gap-1">
                <div className="w-48 h-8 bg-slate-900 flex items-center justify-between px-2 text-white font-mono text-[9px] tracking-widest rounded-xs">
                  <span>||||||||||||||||||||||||||||||||||||||||||||</span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">{sale?.receipt_number}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Bottom Actions: 2 Clear Options (Print or Don't Print) */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3 no-print shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-400" />
            <span>Don't Print (Skip)</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Customer Receipt</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
}

export default ThermalReceiptModal;
