'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle2, Clock, AlertCircle, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getPurchaseOrdersApi } from '@/lib/api';

interface PurchaseOrder {
  id: string | number;
  poNumber: string;
  supplier: string;
  itemsCount: number;
  totalAmount: string;
  expectedDate: string;
  matchingStatus: string;
}

export function PurchaseOrdersQueueCard() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPurchaseOrders() {
      try {
        setLoading(true);
        const res = await getPurchaseOrdersApi();
        const data = Array.isArray(res) ? res : res?.data || [];

        if (data.length > 0) {
          setOrders(
            data.map((po: any, index: number) => ({
              id: po.id || index,
              poNumber: po.po_number || `PO-2026-${String(po.id || index + 80).padStart(4, '0')}`,
              supplier: po.supplier_name || po.supplier?.name || 'Primary Supplier',
              itemsCount: Number(po.items_count || po.total_quantity || 0),
              totalAmount: `$${Number(po.total_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
              expectedDate: po.expected_delivery_date || 'In 2-3 Days',
              matchingStatus: po.status === 'received' ? '3-Way Matched' : po.status === 'pending' ? 'Awaiting Receiving' : '3-Way Matched',
            }))
          );
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error('Failed to load purchase orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    loadPurchaseOrders();
  }, []);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-subtle text-brand flex items-center justify-center">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Purchase Orders (POs)</h3>
            <p className="text-xs text-slate-500 font-medium">3-way matching (PO vs GRN Goods Received vs Invoice)</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-subtle text-brand border border-brand/20">
          {orders.length} Active POs
        </span>
      </div>

      {loading ? (
        <div className="py-8 text-center text-slate-400 font-medium text-xs flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-brand" />
          <span>Fetching live purchase orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-8 px-4 text-center text-slate-400 font-medium text-xs space-y-1">
          <p className="font-extrabold text-slate-700">No Pending Purchase Orders</p>
          <p className="text-[11px] text-slate-400">All supplier shipments and stock replenishment batches are fulfilled.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {orders.map((po) => (
            <div key={po.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-slate-900 truncate">{po.supplier}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                      po.matchingStatus === '3-Way Matched'
                        ? 'bg-emerald-100 text-emerald-700'
                        : po.matchingStatus === 'Awaiting Receiving'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {po.matchingStatus}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  {po.poNumber} • {po.itemsCount} units • Due {po.expectedDate}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-black text-xs text-slate-900 font-mono">{po.totalAmount}</span>
                <Link
                  href="/super-admin/inventory/purchase-orders"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-subtle hover:text-brand font-bold text-xs transition-colors"
                  title="Inspect 3-Way Match & Receive Goods"
                >
                  Receive
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
