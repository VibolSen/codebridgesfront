'use client';

import React, { useState, useEffect } from 'react';
import { Receipt, RefreshCw } from 'lucide-react';
import { getPurchaseOrdersApi } from '@/lib/api';

export const SuperAdminPurchaseOrdersView: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);
      const res = await getPurchaseOrdersApi();
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load purchase orders:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Receipt className="w-7 h-7 text-indigo-600" />
            Purchase Orders (PO) Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Issue official purchase orders to suppliers and track delivery status
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">PO Number</th>
              <th className="py-3 px-4">Target Supplier</th>
              <th className="py-3 px-4">Items Count</th>
              <th className="py-3 px-4">Est. Total ($)</th>
              <th className="py-3 px-4">Order Date</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-1 text-indigo-600" />
                  Loading purchase orders...
                </td>
              </tr>
            ) : orders.map((po) => (
              <tr key={po.id} className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{po.po_number}</td>
                <td className="py-3.5 px-4 font-bold text-slate-800">{po.supplier}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-600">{po.items_count} items</td>
                <td className="py-3.5 px-4 font-mono font-black text-indigo-600 text-sm">
                  ${Number(po.est_total).toFixed(2)}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-500">{po.order_date}</td>
                <td className="py-3.5 px-4 text-right">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      po.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {po.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
