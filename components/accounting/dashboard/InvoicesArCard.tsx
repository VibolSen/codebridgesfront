'use client';

import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, FileText, Send, CheckCircle2, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/client';

export function InvoicesArCard() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoices() {
      try {
        setLoading(true);
        // Load sales orders where payment_status is pending or partial
        const res = await apiFetch('/sales?status=pending');
        const list = Array.isArray(res) ? res : res?.data || [];
        setInvoices(list.slice(0, 5));
      } catch (err) {
        console.error('Failed to load accounts receivable invoices:', err);
      } finally {
        setLoading(false);
      }
    }

    loadInvoices();
  }, []);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Invoices &amp; Receivables (AR)</h3>
            <p className="text-xs text-slate-500 font-medium">B2B client invoices awaiting payment</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700">
          {loading ? '...' : `${invoices.length} Active`}
        </span>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span>Loading receivables...</span>
        </div>
      ) : invoices.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 font-medium space-y-1">
          <p>No outstanding B2B invoices or unpaid orders.</p>
          <p className="text-[11px] text-slate-300">All customer invoices are fully settled.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {invoices.map((inv) => (
            <div key={inv.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-slate-900 truncate">
                    {inv.customer_name || inv.customer?.name || 'Customer Walk-in'}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-700">
                    {inv.status || 'Pending'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  {inv.invoice_number || inv.sale_number || `INV-${inv.id.substring(0, 8)}`}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-black text-xs text-slate-900 font-mono">
                  ${parseFloat(inv.total_amount || inv.total || '0').toFixed(2)}
                </span>
                <Link
                  href={`/pos/orders`}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                  title="View Order Details"
                >
                  <FileText className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
