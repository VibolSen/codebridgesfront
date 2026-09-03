'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Building2, CreditCard, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getPurchaseOrdersApi } from '@/lib/api';

export function BillsApCard() {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBills() {
      try {
        setLoading(true);
        const res = await getPurchaseOrdersApi();
        const list = Array.isArray(res) ? res : res?.data || [];
        const pending = list.filter((b: any) => b.status !== 'received' && b.status !== 'cancelled');
        setBills(pending.slice(0, 5));
      } catch (err) {
        console.error('Failed to load accounts payable bills:', err);
      } finally {
        setLoading(false);
      }
    }

    loadBills();
  }, []);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Bills &amp; Payables (AP)</h3>
            <p className="text-xs text-slate-500 font-medium">Supplier invoices scheduled for disbursement</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
          {loading ? '...' : `${bills.length} Pending`}
        </span>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
          <span>Loading vendor bills...</span>
        </div>
      ) : bills.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 font-medium space-y-1">
          <p>No pending vendor bills or open purchase orders.</p>
          <p className="text-[11px] text-slate-300">All supplier commitments are settled.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {bills.map((b) => (
            <div key={b.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-slate-900 truncate">
                    {b.supplier_name || 'Vendor Supplier'}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                      b.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {b.status || 'Pending'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  {b.po_number || `PO-${b.id.substring(0, 8)}`}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-black text-xs text-slate-900 font-mono">
                  ${parseFloat(b.total_cost || b.amount || '0').toFixed(2)}
                </span>
                <Link
                  href="/super-admin/inventory/purchase-orders"
                  className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <CreditCard className="w-3 h-3" />
                  <span>View</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
