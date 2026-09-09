'use client';

import React, { useState, useEffect } from 'react';
import { Truck, ArrowRight, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getTransfersApi } from '@/lib/api';

interface Transfer {
  id: string | number;
  transferNo: string;
  from: string;
  to: string;
  itemsCount: number;
  status: string;
  driver: string;
}

export function InterWarehouseTransfersCard() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransfers() {
      try {
        setLoading(true);
        const res = await getTransfersApi();
        const data = Array.isArray(res) ? res : res?.data || [];

        if (data.length > 0) {
          setTransfers(
            data.map((t: any, index: number) => ({
              id: t.id || index,
              transferNo: t.transfer_number || `TRF-2026-${String(t.id || index + 30).padStart(4, '0')}`,
              from: t.from_outlet_name || t.source_outlet?.name || 'Main Warehouse Hub',
              to: t.to_outlet_name || t.destination_outlet?.name || 'Retail Branch',
              itemsCount: Number(t.total_quantity || t.items_count || 0),
              status: t.status === 'completed' || t.status === 'received' ? 'Received & Verified' : t.status === 'dispatched' ? 'Out for Delivery' : 'In Transit',
              driver: t.driver_name || t.user_name || 'Assigned Logistics',
            }))
          );
        } else {
          setTransfers([]);
        }
      } catch (err) {
        console.error('Failed to load transfers:', err);
        setTransfers([]);
      } finally {
        setLoading(false);
      }
    }

    loadTransfers();
  }, []);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Inter-Warehouse Transfers</h3>
            <p className="text-xs text-slate-500 font-medium">Active shipments moving between storage zones and outlets</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700">
          {transfers.length} In Motion
        </span>
      </div>

      {loading ? (
        <div className="py-8 text-center text-slate-400 font-medium text-xs flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#5B4DFB]" />
          <span>Fetching live inventory transfer manifests...</span>
        </div>
      ) : transfers.length === 0 ? (
        <div className="py-8 px-4 text-center text-slate-400 font-medium text-xs space-y-1">
          <p className="font-extrabold text-slate-700">No Transfers in Transit</p>
          <p className="text-[11px] text-slate-400">All warehouse hubs and store outlets are balanced.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {transfers.map((t) => (
            <div key={t.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 truncate">
                  <span>{t.from}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="text-[#5B4DFB]">{t.to}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  {t.transferNo} • {t.itemsCount} units • {t.driver}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    t.status === 'Received & Verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {t.status}
                </span>
                <Link
                  href="/super-admin/inventory/transfer"
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
