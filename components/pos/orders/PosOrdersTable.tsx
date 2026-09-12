'use client';

import React from 'react';
import {
  Receipt,
  Printer,
  RotateCcw,
  Banknote,
  QrCode,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';

interface PosOrdersTableProps {
  transactions: any[];
  loading: boolean;
  onReprintReceipt: (transaction: any) => void;
  onIssueRefund?: (transaction: any) => void;
}

export function PosOrdersTable({
  transactions,
  loading,
  onReprintReceipt,
  onIssueRefund,
}: PosOrdersTableProps) {
  if (loading) {
    return (
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-brand" />
          <span>Transactions & Receipts Log</span>
        </h3>
        <span className="text-xs font-bold text-slate-400">
          {transactions.length} records found
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 font-medium">
          No transactions match your current search or tender filter.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                <th className="pb-3">Invoice #</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Payment Tender</th>
                <th className="pb-3 text-right">Items</th>
                <th className="pb-3 text-right">Grand Total</th>
                <th className="pb-3 text-center">Receipt Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {transactions.map((tx) => {
                const tender = (tx.payment_method || tx.tender_type || 'cash').toLowerCase();

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-mono font-bold text-slate-900">
                      {tx.invoice_number || tx.receipt_number || `#CB-${String(tx.id || '').slice(0, 6)}`}
                    </td>
                    <td className="py-3 font-semibold text-slate-800">
                      {tx.customer_name || 'Walk-in Customer'}
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(tx.created_at || Date.now()).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-fit ${
                          tender === 'khqr'
                            ? 'bg-brand-subtle text-brand border border-brand/20'
                            : tender === 'card'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {tender === 'khqr' ? (
                          <QrCode className="w-3 h-3" />
                        ) : tender === 'card' ? (
                          <CreditCard className="w-3 h-3" />
                        ) : (
                          <Banknote className="w-3 h-3" />
                        )}
                        <span>{tender}</span>
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-slate-600">
                      {tx.items_count || (tx.items ? tx.items.length : 1)}
                    </td>
                    <td className="py-3 text-right font-mono font-black text-slate-900 text-sm">
                      ${Number(tx.grand_total || tx.total_amount || tx.total || 0).toFixed(2)}
                    </td>
                    <td className="py-3 text-center">
                      <button
                        type="button"
                        onClick={() => onReprintReceipt(tx)}
                        className="px-2.5 py-1 rounded-lg bg-brand-subtle hover:bg-brand text-brand hover:text-white border border-brand/20 text-xs font-bold transition-all flex items-center gap-1 mx-auto cursor-pointer shadow-2xs"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
